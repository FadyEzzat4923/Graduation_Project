using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project_DAL.Migrations
{
    public partial class Motherhood : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tips",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tips", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ResetCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResetCodeExpiration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BabyRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    prediction = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AIName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BabyRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BabyRecords_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsEdited = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PictureUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WhatsappNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsLove = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTip",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TipId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTip", x => new { x.UserId, x.TipId });
                    table.ForeignKey(
                        name: "FK_UserTip_Tips_TipId",
                        column: x => x.TipId,
                        principalTable: "Tips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTip_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MessageDeleteds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageDeleteds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MessageDeleteds_Messages_MessageId",
                        column: x => x.MessageId,
                        principalTable: "Messages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MessageDeleteds_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SavedProducts",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProductId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Id = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedProducts", x => new { x.UserId, x.ProductId });
                    table.ForeignKey(
                        name: "FK_SavedProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SavedProducts_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Tips",
                columns: new[] { "Id", "Description", "Title" },
                values: new object[,]
                {
                    { new Guid("0287eb9f-c748-4e61-9a04-b523ee77b4b5"), "Always have a well-stocked first-aid kit at home with essentials like bandages, antiseptics, and a thermometer. Learn basic infant CPR and choking rescue techniques, and keep emergency contact numbers readily available in case of urgent medical situations.", "First Aid Basics" },
                    { new Guid("04c2532d-c204-41a5-87f8-eae165b07f37"), "Recognize and celebrate your baby's achievements, no matter how small, to boost their confidence. Applauding milestones like first steps, new words, or successful potty training encourages continued learning and strengthens your emotional connection.", "Celebrating Small Wins" },
                    { new Guid("0544dd3a-821a-49a3-8817-b2c1df9ef99e"), "Prevent diaper rash by changing diapers frequently and allowing the area to air out. Apply zinc oxide cream as a barrier and use gentle, fragrance-free wipes. If a rash persists or worsens, consult your pediatrician for appropriate treatment options.", "Diaper Rash Care" },
                    { new Guid("067c23cb-32f2-460b-93c2-d5093005ccc3"), "Spending time outdoors is essential for your baby's physical and mental development. Fresh air, natural light, and safe outdoor activities stimulate the senses and support overall health. Always use appropriate sun protection and stay mindful of weather conditions.", "Outdoor Time" },
                    { new Guid("08acc56b-2c81-48c6-ace5-a5c4c461ad67"), "Teething can be uncomfortable, so offer your baby cold teething rings or a clean, damp washcloth to chew on. Gently massage their gums with your finger and use pediatrician-approved remedies if necessary to help ease their discomfort during this stage.", "Teething Relief" },
                    { new Guid("0b6875cc-d7f3-4482-9c78-7338daadf13e"), "Place your baby on their back to sleep on a firm mattress without loose bedding, pillows, or stuffed animals. This reduces the risk of sudden infant death syndrome (SIDS) and creates a safer sleeping environment.", "Safe Sleeping" },
                    { new Guid("0f8c2d83-7bc7-46f2-bab2-daccfa3e5f0a"), "Incorporate textures, sounds, and colors into your baby's playtime to stimulate their senses and encourage cognitive development. Activities like playing with soft fabrics, musical toys, and colorful stacking blocks help support learning and fine motor skills.", "Sensory Play" },
                    { new Guid("121ac25e-60aa-446b-a37a-6ba8baa0ef7c"), "Use a rear-facing car seat for your baby, following the manufacturer's guidelines, and ensure it's properly installed. Plan for frequent breaks during long trips for feeding and diaper changes, and never leave your baby unattended in the car.", "Traveling Safely" },
                    { new Guid("184b3172-0c93-45a8-a000-c1bd7f9bfed7"), "Place toys just out of your baby's reach on a soft surface to motivate them to crawl. This helps strengthen their muscles, improve coordination, and develop important motor skills necessary for walking and other physical activities.", "Encouraging Crawling" },
                    { new Guid("1923628a-903b-4e19-8539-4ffd71fe4d6e"), "When outdoors, protect your baby from direct sunlight using baby-safe sunscreen, wide-brimmed hats, and lightweight clothing. Limit sun exposure during peak hours, and always use a stroller with a sunshade or find shaded areas.", "Sun Safety" },
                    { new Guid("1bd17470-35c0-4382-a837-73b3a2df773d"), "Offer a variety of healthy snack options like soft fruits, steamed vegetables, yogurt, and whole grain crackers. Avoid sugary and processed foods, and encourage self-feeding to help your baby develop fine motor skills and healthy eating habits.", "Healthy Snacks" },
                    { new Guid("2dfb8973-7690-44dd-8560-79b5f8a667a4"), "Ensure your baby receives regular medical check-ups to monitor growth and development. Create a safe and clean environment at home, free from hazards, and always keep emergency contacts easily accessible for peace of mind.", "Baby Care Tips" },
                    { new Guid("2e383cf7-95be-4410-b121-e35dad9f57d4"), "Soothe a colicky baby by using gentle rocking motions, white noise, and tummy massages. Hold your baby upright after feedings, try warm baths, and maintain a calm environment to help reduce discomfort and frequent crying episodes.", "Colic Soothing" },
                    { new Guid("30bcc1f3-07d9-4a8b-80bb-a1de3dac0d74"), "Talk, sing, and read to your baby every day to help develop their language skills. Use simple words, repeat sounds, and engage in conversations even if they can't respond yet, fostering early communication and cognitive development.", "Early Language Development" },
                    { new Guid("360b59ef-7f82-4211-b5aa-21e1b6b0afdd"), "Praise your baby's positive behaviors with smiles, claps, or words of encouragement. This reinforces good habits and builds self-esteem, helping your baby feel valued and motivated to repeat those behaviors in the future.", "Positive Reinforcement" },
                    { new Guid("363a3924-3671-46e0-8382-5909e4702646"), "Respond empathetically to your baby's emotions by offering comfort and affection when they are upset. Positive interactions, like smiling, cuddling, and playing, help build trust, emotional security, and healthy social skills over time.", "Emotional Development" },
                    { new Guid("3ca33b06-3498-42b2-b20e-b073b4af4686"), "Ease your baby's separation anxiety by practicing short, calm goodbyes and reassuring them that you'll return. Establish consistent routines, introduce comfort objects like a favorite toy, and gradually increase time apart to help build confidence.", "Dealing with Separation Anxiety" },
                    { new Guid("451cdfff-da22-410d-b96e-09f60914242b"), "Avoid exposing babies under 18 months to screens, including TVs, tablets, and smartphones. Instead, focus on interactive play, reading, and real-world experiences to promote healthy brain development, language skills, and emotional growth.", "Limit Screen Time" },
                    { new Guid("49955950-71c1-4da2-bda4-1dfb4b6904aa"), "Introduce new foods gradually, one at a time, and monitor for signs of allergic reactions like rashes, vomiting, or difficulty breathing. Always consult your pediatrician about the best time to introduce common allergens like peanuts and eggs.", "Allergy Awareness" },
                    { new Guid("573b37af-869b-4a96-a8c7-39c16da65157"), "Prioritize rest, hydration, and mental health during postpartum recovery. Accept help from family and friends, take short naps when possible, and seek support if you experience mood changes or feelings of overwhelm during this transitional period.", "Postpartum Self-Care" },
                    { new Guid("76482033-cd48-4eb0-9373-ea6cea62d542"), "Swaddle your newborn to provide a sense of security and improve sleep. Use a breathable blanket, ensuring hips remain loose to prevent hip dysplasia. Stop swaddling once your baby shows signs of rolling over for safety reasons.", "Swaddling Tips" },
                    { new Guid("7bc67bf3-855a-45fc-b832-4ead7018d868"), "Never leave your baby unattended during bath time, even for a moment. Always check that the water temperature is lukewarm, use non-slip mats, and keep bathing supplies within reach to ensure a safe and enjoyable experience.", "Bath Time Safety" },
                    { new Guid("7e14b154-8244-455b-8a5c-b96d124b1ddb"), "Create predictable routines for feeding, sleeping, and playtime to help your baby feel secure and understand what to expect. Consistency promotes healthy habits, reduces anxiety, and supports better sleep and overall development.", "Consistent Routines" },
                    { new Guid("82f0ecf3-ec4d-4e4e-a8cd-2530b4340ae0"), "Use positive reinforcement and redirection to guide your baby's behavior. Encourage good habits by praising positive actions, and avoid harsh discipline methods that can negatively impact emotional development and trust.", "Gentle Discipline" },
                    { new Guid("85fa0d5e-1786-458f-9ec3-8b1229601403"), "Give your toddler age-appropriate tasks like self-feeding or tidying toys to foster independence and build confidence. Encourage problem-solving and decision-making by offering simple choices, helping them develop important life skills.", "Encouraging Independence" },
                    { new Guid("877d09dc-292b-4020-b08b-345bcd387a42"), "Track your baby's developmental milestones, such as rolling over, crawling, and first words. Remember that every child develops at their own pace, so use milestones as general guidelines rather than strict deadlines.", "Monitor Milestones" },
                    { new Guid("88a33343-b7c6-436e-ad4c-98fc9abee9c2"), "Incorporate tummy time into your baby’s daily routine to help strengthen neck, shoulder, and arm muscles. Place your baby on a soft mat under supervision, starting with a few minutes a day and gradually increasing the duration as they grow.", "Tummy Time" },
                    { new Guid("91a0d18f-9120-4f6a-aedd-50013a1f8d22"), "For the first six months, breast milk or formula provides all necessary hydration. After six months, you can gradually introduce small amounts of water, especially in hot weather, while continuing regular milk feedings to maintain proper hydration.", "Hydration Tips" },
                    { new Guid("95d75535-30e7-4582-bbae-1ccae505c1bc"), "Always check bath water temperature to ensure it's lukewarm and monitor your home's room temperature to prevent overheating. Dress your baby in appropriate layers for the weather and avoid heavy blankets during sleep for safety.", "Temperature Checks" },
                    { new Guid("98f1522d-7f61-4e37-a0ed-dcb004919ec9"), "Maintain a balanced diet rich in vitamins, minerals, and protein to support milk production during breastfeeding. Stay hydrated, avoid excessive caffeine, and consult a healthcare provider for supplements if needed to ensure both you and your baby thrive.", "Breastfeeding Nutrition" },
                    { new Guid("a12a6f26-3013-4d4e-9e7c-023d3c41456b"), "Hold, cuddle, and talk to your baby often to create a strong emotional connection. Skin-to-skin contact, eye contact, and gentle communication help build trust and foster emotional security, which are vital for healthy development.", "Emotional Bonding" },
                    { new Guid("a38e466a-d93a-47cb-bfef-2787b033709d"), "Baby-proof your home by using outlet covers, installing baby gates, and securing furniture to walls. Keep sharp objects, small items, and cleaning supplies out of reach. Regularly check for potential hazards as your baby becomes more mobile.", "Safety at Home" },
                    { new Guid("a4cf960d-d4e0-4109-b8d6-859bed95c6fe"), "Involve siblings and partners in daily baby care routines like feeding, diaper changes, and playtime. This strengthens family bonds, fosters teamwork, and helps everyone feel included in the baby's growth and development journey.", "Family Bonding" },
                    { new Guid("a51414ab-e721-4809-9a00-c7c9a3b182e4"), "Make reading a daily habit to promote language development and cognitive growth. Choose colorful, age-appropriate books and use expressive voices to keep your baby engaged. Reading together also strengthens emotional bonds and fosters a lifelong love for books.", "Reading to Your Baby" },
                    { new Guid("ac9188d2-b4d7-4177-9cf0-d8171416e305"), "Offer your baby a variety of fruits, vegetables, grains, and proteins to promote a balanced diet. Avoid added sugars and overly processed foods, and focus on nutrient-dense options to support healthy growth and development.", "Balanced Diet" },
                    { new Guid("b0a0c2d3-f93f-4b51-8b9d-c65a15999993"), "Secure heavy furniture to walls, use outlet covers, install safety gates, and keep sharp objects, cleaning supplies, and small items out of reach. Regularly inspect your home for potential hazards as your baby becomes more mobile.", "Childproofing" },
                    { new Guid("b0e1d735-aa51-4343-9a39-5f204aa3b906"), "Begin introducing solids around six months, starting with pureed vegetables and fruits. Gradually add iron-rich foods, grains, and proteins, offering one new food at a time to monitor for allergies. Avoid honey and whole nuts before the age of one.", "Introducing Solids" },
                    { new Guid("b5ea1437-215c-4b6c-bc3c-8bb4facf9795"), "Pay close attention to your baby’s different cries, as they often signal specific needs like hunger, sleepiness, or discomfort. Over time, you’ll become better at recognizing these cues, helping you respond quickly and effectively to soothe your baby.", "Understanding Cries" },
                    { new Guid("eb4552ee-6583-4be3-a696-dad9bbb1d9d6"), "Establish a consistent bedtime routine that includes calming activities like a warm bath or gentle lullabies. Ensure the sleeping environment is safe and quiet, and place your baby on their back to sleep to reduce the risk of SIDS.", "Healthy Sleep Habits" },
                    { new Guid("eb607ec9-d45a-4fff-bbab-3b05ef8cd53a"), "Breastfeeding is ideal for the first 6 months, providing essential nutrients and antibodies. When introducing solids, start with pureed fruits and vegetables, and gradually expand to grains and proteins while monitoring for any allergic reactions.", "Nutrition Advice" },
                    { new Guid("ec2c57c6-a69d-4cb0-b809-445bd4123a8e"), "Enhance your baby's vocabulary by naming objects during playtime, reading books with simple words, and describing everyday activities. Repetition and exposure to language help strengthen communication skills and encourage early word recognition.", "Building Vocabulary" },
                    { new Guid("f8fad182-ba29-4152-8353-b800b1470040"), "Follow your pediatrician’s recommended vaccination schedule to protect your baby against preventable diseases. Keep an updated immunization record and stay informed about any additional vaccines that may be needed based on your location or specific health considerations.", "Vaccination Schedule" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_BabyRecords_UserId",
                table: "BabyRecords",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageDeleteds_MessageId",
                table: "MessageDeleteds",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageDeleteds_UserId",
                table: "MessageDeleteds",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserId",
                table: "Messages",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_UserId",
                table: "Products",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SavedProducts_ProductId",
                table: "SavedProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "User",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "User",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_UserTip_TipId",
                table: "UserTip",
                column: "TipId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "BabyRecords");

            migrationBuilder.DropTable(
                name: "MessageDeleteds");

            migrationBuilder.DropTable(
                name: "SavedProducts");

            migrationBuilder.DropTable(
                name: "UserTip");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Tips");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
