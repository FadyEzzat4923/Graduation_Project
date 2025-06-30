using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project.Dots;
using project.Dtos;
using project_BLL.Identity;
using project_DAL.Entities;
using project_DAL.Identity;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly StoreContext _context;

    public MessagesController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var messages = await _context.Messages
            .Where(m => !_context.MessageDeleteds
            .Any(md => md.MessageId == m.Id && md.UserId == userId))
            .OrderBy(m => m.Timestamp)
            .Include(m => m.User)
            .Select(m => new
            {
                id = m.Id,
                text = m.Text,
                timestamp = m.Timestamp,
                isEdited = m.IsEdited,
                canEdit = DateTime.UtcNow - m.CreatedAt <= TimeSpan.FromMinutes(30),

                user = new
                {
                    id = m.User.Id,
                    email = m.User.Email,
                    fullName = m.User.FirstName + " " + m.User.LastName
                }
            })
            .ToListAsync();

        return Ok(messages);
    }






    [HttpGet("{id}")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var message = await _context.Messages
            .Where(m => m.Id == id)
            .Include(m => m.User)
            .OrderBy(m => m.Timestamp)
            .Select(m => new
            {
                m.Id,
                m.Text,
                m.Timestamp,
                m.IsEdited,
                m.User.Email,
                UserFullName = m.User.FirstName + " " + m.User.LastName,
            })
            .FirstOrDefaultAsync();

        if (message == null)
            return NotFound("Message not found.");

        return Ok(message);
    }


    [HttpPost]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> Create([FromBody] MessageDto messageDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);



        var message = new Message
        {
            Text = messageDto.Text,
            Timestamp = DateTime.UtcNow,
            UserId = userId
        };

        _context.Messages.Add(message);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = message.Id }, message);
    }


    [HttpPut("{id}")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> Update(Guid id, [FromBody] MessageDto messageDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var existingMessage = await _context.Messages
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (existingMessage == null)
            return NotFound("Message not found or you don't have permission to edit it.");

        if (existingMessage.CreatedAt == default)
            return StatusCode(500, "Message does not have a valid CreatedAt timestamp.");

        var timeSinceSent = DateTime.UtcNow - existingMessage.CreatedAt;
        if (timeSinceSent > TimeSpan.FromMinutes(30))
            return BadRequest("You can no longer edit this message. Editing time limit exceeded.");

        existingMessage.Text = messageDto.Text;
        existingMessage.IsEdited = true;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Message updated successfully." });
    
    }

    [HttpDelete("for-me/{id}")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> DeleteForMe(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var message = await _context.Messages.FindAsync(id);
        if (message == null)
            return NotFound("Message not found.");

        var alreadyDeleted = await _context.MessageDeleteds
            .AnyAsync(md => md.MessageId == id && md.UserId == userId);

        if (alreadyDeleted)
            return BadRequest("You already deleted this message.");

        var deletedRecord = new MessageDeleted
        {
            UserId = userId,
            MessageId = message.Id
        };

        _context.MessageDeleteds.Add(deletedRecord);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Message deleted for you only." });
    }


    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (message == null)
            return NotFound("Message not found or you don't have permission to delete it.");

        var deletedRecords = _context.MessageDeleteds.Where(md => md.MessageId == id);
        _context.MessageDeleteds.RemoveRange(deletedRecords);

        _context.Messages.Remove(message);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Message deleted for everyone successfully." });
    }

}
