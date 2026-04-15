require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const axios = require('axios');
// const FormData = require('form-data');

const app = express();
app.use(cors());
app.use(express.json());

// יצירת תיקיית העלאות זמנית אם היא לא קיימת
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// הגדרת Multer - כולל בדיקות בסיסיות (Validation)
const upload = multer({ 
    dest: uploadDir,
    limits: { fileSize: 50 * 1024 * 1024 }, // הגבלת גודל ל-5 מגה
    fileFilter: (req, file, cb) => {
        // בדיקה שאכן מדובר בתמונה
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('רק קבצי תמונה מורשים!'), false);
        }
    }
});

// נקודת הקצה (Endpoint) לקבלת התמונה
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const taskId = req.body.taskId; // איזה חדר צולם?

        if (!file) {
            return res.status(400).json({ error: 'לא התקבלה תמונה' });
        }

        console.log(`Received file for task: ${taskId}, File: ${file.originalname}`);

        // --- כאן נכנסת הלוגיקה העסקית וה-AI ---
        
        // סימולציה של שליחה ל-AI (Computer Vision)
        console.log("Analyzing image with AI...");
        await new Promise(resolve => setTimeout(resolve, 1500)); // מחכים 1.5 שניות בשביל ההדגמה


/* === ברגע שיש לך URL מהחברות, תמחקי את נתוני הדמה של mockAiResponse ותפעילי את הקוד הזה: ===
        
        const form = new FormData();
        form.append('image', fs.createReadStream(file.path));
        
        // שליחת הבקשה לשרת שלהן (להחליף את הכתובת כשיתנו לך)
        const response = await axios.post('הכניסי_כאן_את_הכתובת_שלהן', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // הנתונים האמיתיים מהאינטרנט פשוט ידרסו את נתוני הדמה שהיו פה קודם
        const mockAiResponse = response.data; 
        
        ======================================================================================== */


        // יצירת נתוני הדמה (Mock) - הפלט שמצפים לקבל מצוות ה-AI
        // טיפ להדגמה: כדי להראות הצלחה, שני את wall_moisture_detected ל-false
        const mockAiResponse = {
            unoccupied_signs: false,
            wall_moisture_detected: false, // שמנו פה 'אמת' (true) כדי לדמות תמונה עם רטיבות
            severe_neglect: false,
            overcrowding_signs: false,
            large_pergola: false,
            pool_or_jacuzzi: false,
            split_apartment: false,
            business_activity: false,
            expensive_storage: false,
            is_luxury_apartment: false,
            estimated_age_years: 12,
            estimated_area_sqm: 110,
            hazard_description: "זוהה כתם שחור על קיר הסלון"
        };

        // בדיקת הלוגיקה העסקית: האם יש "דגלים אדומים"?
        const hasRedFlags = 
            mockAiResponse.wall_moisture_detected || 
            mockAiResponse.severe_neglect || 
            mockAiResponse.business_activity || 
            mockAiResponse.split_apartment;
        
        if (!hasRedFlags) {
            // התמונה אושרה! (אין שום דגל אדום)
            return res.status(200).json({ 
                success: true, 
                message: 'התמונה אושרה ונותחה בהצלחה',
                aiData: mockAiResponse, // שומרים את הנתונים
                taskId: taskId
            });
        } else {
            // ה-AI זיהה בעיה (רטיבות במקרה הזה)
            // מוחקים את התמונה מהשרת כי היא לא תקינה
            fs.unlinkSync(file.path); 
            
            // מתאימים את הודעת השגיאה ללקוח לפי הבעיה שנמצאה
            let errorMessage = 'התמונה לא ברורה או לא עמדה בתנאים.';
            if (mockAiResponse.wall_moisture_detected) {
                errorMessage = 'המערכת זיהתה חשד לרטיבות בקירות. אנא פנה לנציג או צלם שוב.';
            } else if (mockAiResponse.business_activity) {
                errorMessage = 'המערכת זיהתה פעילות עסקית החורגת מתנאי הפוליסה.';
            }

            return res.status(400).json({ 
                success: false, 
                error: errorMessage,
                taskId: taskId
            });
        }

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: 'שגיאת שרת פנימית' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
