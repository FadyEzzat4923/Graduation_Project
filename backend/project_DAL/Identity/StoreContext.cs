using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using project_DAL.Entities;
using project_DAL.Entities.MotherGuids;
using project_DAL.Identity;
using Project_DAL.Entities.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace project_BLL.Identity
{
    public class StoreContext: IdentityDbContext<AppUser>
    {
        public StoreContext(DbContextOptions<StoreContext> options):base(options)
        {

        }
        public DbSet<AppUser> Users { get; set; }

        public DbSet<Message> Messages { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<SavedProduct> SavedProducts { get; set; }

        public DbSet<BabyRecord> BabyRecords { get; set; }
        public DbSet<Tip> Tips { get; set; }
        public DbSet<MessageDeleted> MessageDeleteds { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<AppUser>().ToTable("User");

            modelBuilder.Entity<SavedProduct>()
                .HasKey(sp => new { sp.UserId, sp.ProductId });

            modelBuilder.Entity<SavedProduct>()
                .HasOne(sp => sp.User)
                .WithMany(u => u.SavedProducts)
                .HasForeignKey(sp => sp.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<SavedProduct>()
                .HasOne(sp => sp.Product)
                .WithMany(p => p.SavedByUsers)
                .HasForeignKey(sp => sp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MessageDeleted>()
          .HasOne(md => md.Message)
          .WithMany()
          .HasForeignKey(md => md.MessageId)
          .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<MessageDeleted>()
                .HasOne(md => md.User)
                .WithMany(u => u.MessagesDeleted)
                .HasForeignKey(md => md.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            modelBuilder.Entity<UserTip>()
                .HasKey(ut => new { ut.UserId, ut.TipId });

            modelBuilder.Entity<UserTip>()
                .HasOne(ut => ut.User)
                .WithMany(u => u.UserTips)
                .HasForeignKey(ut => ut.UserId);

            modelBuilder.Entity<UserTip>()
                .HasOne(ut => ut.Tip)
                .WithMany(t => t.UserTips)
                .HasForeignKey(ut => ut.TipId);


            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            modelBuilder.Entity<Tip>().HasData(
                     new Tip { Id = Guid.NewGuid(), Title = "Baby Care Tips", Description = "Ensure your baby receives regular medical check-ups to monitor growth and development. Create a safe and clean environment at home, free from hazards, and always keep emergency contacts easily accessible for peace of mind." },
new Tip { Id = Guid.NewGuid(), Title = "Nutrition Advice", Description = "Breastfeeding is ideal for the first 6 months, providing essential nutrients and antibodies. When introducing solids, start with pureed fruits and vegetables, and gradually expand to grains and proteins while monitoring for any allergic reactions." },
new Tip { Id = Guid.NewGuid(), Title = "Emotional Bonding", Description = "Hold, cuddle, and talk to your baby often to create a strong emotional connection. Skin-to-skin contact, eye contact, and gentle communication help build trust and foster emotional security, which are vital for healthy development." },
new Tip { Id = Guid.NewGuid(), Title = "Safety at Home", Description = "Baby-proof your home by using outlet covers, installing baby gates, and securing furniture to walls. Keep sharp objects, small items, and cleaning supplies out of reach. Regularly check for potential hazards as your baby becomes more mobile." },
new Tip { Id = Guid.NewGuid(), Title = "Healthy Sleep Habits", Description = "Establish a consistent bedtime routine that includes calming activities like a warm bath or gentle lullabies. Ensure the sleeping environment is safe and quiet, and place your baby on their back to sleep to reduce the risk of SIDS." },
new Tip { Id = Guid.NewGuid(), Title = "Hydration Tips", Description = "For the first six months, breast milk or formula provides all necessary hydration. After six months, you can gradually introduce small amounts of water, especially in hot weather, while continuing regular milk feedings to maintain proper hydration." },
new Tip { Id = Guid.NewGuid(), Title = "Tummy Time", Description = "Incorporate tummy time into your baby’s daily routine to help strengthen neck, shoulder, and arm muscles. Place your baby on a soft mat under supervision, starting with a few minutes a day and gradually increasing the duration as they grow." },
new Tip { Id = Guid.NewGuid(), Title = "Understanding Cries", Description = "Pay close attention to your baby’s different cries, as they often signal specific needs like hunger, sleepiness, or discomfort. Over time, you’ll become better at recognizing these cues, helping you respond quickly and effectively to soothe your baby." },
new Tip { Id = Guid.NewGuid(), Title = "First Aid Basics", Description = "Always have a well-stocked first-aid kit at home with essentials like bandages, antiseptics, and a thermometer. Learn basic infant CPR and choking rescue techniques, and keep emergency contact numbers readily available in case of urgent medical situations." },
new Tip { Id = Guid.NewGuid(), Title = "Introducing Solids", Description = "Begin introducing solids around six months, starting with pureed vegetables and fruits. Gradually add iron-rich foods, grains, and proteins, offering one new food at a time to monitor for allergies. Avoid honey and whole nuts before the age of one." },
new Tip { Id = Guid.NewGuid(), Title = "Outdoor Time", Description = "Spending time outdoors is essential for your baby's physical and mental development. Fresh air, natural light, and safe outdoor activities stimulate the senses and support overall health. Always use appropriate sun protection and stay mindful of weather conditions." },
new Tip { Id = Guid.NewGuid(), Title = "Diaper Rash Care", Description = "Prevent diaper rash by changing diapers frequently and allowing the area to air out. Apply zinc oxide cream as a barrier and use gentle, fragrance-free wipes. If a rash persists or worsens, consult your pediatrician for appropriate treatment options." },
new Tip { Id = Guid.NewGuid(), Title = "Vaccination Schedule", Description = "Follow your pediatrician’s recommended vaccination schedule to protect your baby against preventable diseases. Keep an updated immunization record and stay informed about any additional vaccines that may be needed based on your location or specific health considerations." },
new Tip { Id = Guid.NewGuid(), Title = "Reading to Your Baby", Description = "Make reading a daily habit to promote language development and cognitive growth. Choose colorful, age-appropriate books and use expressive voices to keep your baby engaged. Reading together also strengthens emotional bonds and fosters a lifelong love for books." },
new Tip { Id = Guid.NewGuid(), Title = "Teething Relief", Description = "Teething can be uncomfortable, so offer your baby cold teething rings or a clean, damp washcloth to chew on. Gently massage their gums with your finger and use pediatrician-approved remedies if necessary to help ease their discomfort during this stage." },
new Tip { Id = Guid.NewGuid(), Title = "Monitor Milestones", Description = "Track your baby's developmental milestones, such as rolling over, crawling, and first words. Remember that every child develops at their own pace, so use milestones as general guidelines rather than strict deadlines." },
new Tip { Id = Guid.NewGuid(), Title = "Gentle Discipline", Description = "Use positive reinforcement and redirection to guide your baby's behavior. Encourage good habits by praising positive actions, and avoid harsh discipline methods that can negatively impact emotional development and trust." },
new Tip { Id = Guid.NewGuid(), Title = "Breastfeeding Nutrition", Description = "Maintain a balanced diet rich in vitamins, minerals, and protein to support milk production during breastfeeding. Stay hydrated, avoid excessive caffeine, and consult a healthcare provider for supplements if needed to ensure both you and your baby thrive." },
new Tip { Id = Guid.NewGuid(), Title = "Postpartum Self-Care", Description = "Prioritize rest, hydration, and mental health during postpartum recovery. Accept help from family and friends, take short naps when possible, and seek support if you experience mood changes or feelings of overwhelm during this transitional period." },
new Tip { Id = Guid.NewGuid(), Title = "Swaddling Tips", Description = "Swaddle your newborn to provide a sense of security and improve sleep. Use a breathable blanket, ensuring hips remain loose to prevent hip dysplasia. Stop swaddling once your baby shows signs of rolling over for safety reasons." },
new Tip { Id = Guid.NewGuid(), Title = "Colic Soothing", Description = "Soothe a colicky baby by using gentle rocking motions, white noise, and tummy massages. Hold your baby upright after feedings, try warm baths, and maintain a calm environment to help reduce discomfort and frequent crying episodes." },
new Tip { Id = Guid.NewGuid(), Title = "Family Bonding", Description = "Involve siblings and partners in daily baby care routines like feeding, diaper changes, and playtime. This strengthens family bonds, fosters teamwork, and helps everyone feel included in the baby's growth and development journey." },
new Tip { Id = Guid.NewGuid(), Title = "Limit Screen Time", Description = "Avoid exposing babies under 18 months to screens, including TVs, tablets, and smartphones. Instead, focus on interactive play, reading, and real-world experiences to promote healthy brain development, language skills, and emotional growth." },
new Tip { Id = Guid.NewGuid(), Title = "Dealing with Separation Anxiety", Description = "Ease your baby's separation anxiety by practicing short, calm goodbyes and reassuring them that you'll return. Establish consistent routines, introduce comfort objects like a favorite toy, and gradually increase time apart to help build confidence." },
new Tip { Id = Guid.NewGuid(), Title = "Healthy Snacks", Description = "Offer a variety of healthy snack options like soft fruits, steamed vegetables, yogurt, and whole grain crackers. Avoid sugary and processed foods, and encourage self-feeding to help your baby develop fine motor skills and healthy eating habits." },
new Tip { Id = Guid.NewGuid(), Title = "Bath Time Safety", Description = "Never leave your baby unattended during bath time, even for a moment. Always check that the water temperature is lukewarm, use non-slip mats, and keep bathing supplies within reach to ensure a safe and enjoyable experience." },
new Tip { Id = Guid.NewGuid(), Title = "Early Language Development", Description = "Talk, sing, and read to your baby every day to help develop their language skills. Use simple words, repeat sounds, and engage in conversations even if they can't respond yet, fostering early communication and cognitive development." },
new Tip { Id = Guid.NewGuid(), Title = "Allergy Awareness", Description = "Introduce new foods gradually, one at a time, and monitor for signs of allergic reactions like rashes, vomiting, or difficulty breathing. Always consult your pediatrician about the best time to introduce common allergens like peanuts and eggs." },
new Tip { Id = Guid.NewGuid(), Title = "Safe Sleeping", Description = "Place your baby on their back to sleep on a firm mattress without loose bedding, pillows, or stuffed animals. This reduces the risk of sudden infant death syndrome (SIDS) and creates a safer sleeping environment." },
new Tip { Id = Guid.NewGuid(), Title = "Childproofing", Description = "Secure heavy furniture to walls, use outlet covers, install safety gates, and keep sharp objects, cleaning supplies, and small items out of reach. Regularly inspect your home for potential hazards as your baby becomes more mobile." },
new Tip { Id = Guid.NewGuid(), Title = "Sensory Play", Description = "Incorporate textures, sounds, and colors into your baby's playtime to stimulate their senses and encourage cognitive development. Activities like playing with soft fabrics, musical toys, and colorful stacking blocks help support learning and fine motor skills." },
new Tip { Id = Guid.NewGuid(), Title = "Sun Safety", Description = "When outdoors, protect your baby from direct sunlight using baby-safe sunscreen, wide-brimmed hats, and lightweight clothing. Limit sun exposure during peak hours, and always use a stroller with a sunshade or find shaded areas." },
new Tip { Id = Guid.NewGuid(), Title = "Emotional Development", Description = "Respond empathetically to your baby's emotions by offering comfort and affection when they are upset. Positive interactions, like smiling, cuddling, and playing, help build trust, emotional security, and healthy social skills over time." },
new Tip { Id = Guid.NewGuid(), Title = "Encouraging Crawling", Description = "Place toys just out of your baby's reach on a soft surface to motivate them to crawl. This helps strengthen their muscles, improve coordination, and develop important motor skills necessary for walking and other physical activities." },
new Tip { Id = Guid.NewGuid(), Title = "Consistent Routines", Description = "Create predictable routines for feeding, sleeping, and playtime to help your baby feel secure and understand what to expect. Consistency promotes healthy habits, reduces anxiety, and supports better sleep and overall development." },
new Tip { Id = Guid.NewGuid(), Title = "Traveling Safely", Description = "Use a rear-facing car seat for your baby, following the manufacturer's guidelines, and ensure it's properly installed. Plan for frequent breaks during long trips for feeding and diaper changes, and never leave your baby unattended in the car." },
new Tip { Id = Guid.NewGuid(), Title = "Temperature Checks", Description = "Always check bath water temperature to ensure it's lukewarm and monitor your home's room temperature to prevent overheating. Dress your baby in appropriate layers for the weather and avoid heavy blankets during sleep for safety." },
new Tip { Id = Guid.NewGuid(), Title = "Encouraging Independence", Description = "Give your toddler age-appropriate tasks like self-feeding or tidying toys to foster independence and build confidence. Encourage problem-solving and decision-making by offering simple choices, helping them develop important life skills." },
new Tip { Id = Guid.NewGuid(), Title = "Building Vocabulary", Description = "Enhance your baby's vocabulary by naming objects during playtime, reading books with simple words, and describing everyday activities. Repetition and exposure to language help strengthen communication skills and encourage early word recognition." },
new Tip { Id = Guid.NewGuid(), Title = "Balanced Diet", Description = "Offer your baby a variety of fruits, vegetables, grains, and proteins to promote a balanced diet. Avoid added sugars and overly processed foods, and focus on nutrient-dense options to support healthy growth and development." },
new Tip { Id = Guid.NewGuid(), Title = "Positive Reinforcement", Description = "Praise your baby's positive behaviors with smiles, claps, or words of encouragement. This reinforces good habits and builds self-esteem, helping your baby feel valued and motivated to repeat those behaviors in the future." },
new Tip { Id = Guid.NewGuid(), Title = "Celebrating Small Wins", Description = "Recognize and celebrate your baby's achievements, no matter how small, to boost their confidence. Applauding milestones like first steps, new words, or successful potty training encourages continued learning and strengthens your emotional connection." }
           );
        }


    }
    }

    

