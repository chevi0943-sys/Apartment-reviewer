// import React, { useState, useEffect, ChangeEvent } from 'react';
// import myData from '../data.json';
// // === הגדרת טיפוסים (Types & Interfaces) ===

// interface property_characteristics {
//   rooms: number;
//   has_balcony: boolean;
//   has_storage_room: boolean;
// }

// interface SessionData {
//   property_characteristics: property_characteristics;
// }

// // הגדרת המצבים האפשריים למשימה
// type TaskStatus = 'pending' | 'uploaded';

// // המבנה של משימת צילום בודדת
// interface Task {
//   id: string;
//   name: string;
//   status: TaskStatus;
//   file: File | null; // משתנה שיכיל את אובייקט הקובץ עצמו
// }

// // אלו נתוני הדמה (Mock)
// const mockSessionData: SessionData = {
//   property_characteristics: {
//     rooms: 4.5,
//     has_balcony: true,
//     has_storage_room: true
//   }
// };

// export default function InsuranceUploadApp() {
//   // שימוש ב-Generics כדי להגדיר את סוג הנתונים ב-State
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [isUploading, setIsUploading] = useState<boolean>(false);

//   useEffect(() => {
//     const buildTasks = () => {
//       const { rooms, has_balcony, has_storage_room } = mockSessionData.property_characteristics;

//       let newTasks: Task[] = [
//         { id: 'living_room', name: 'סלון', status: 'pending', file: null },
//         { id: 'kitchen', name: 'מטבח', status: 'pending', file: null }
//       ];

//       const bedroomsCount = Math.floor(rooms - 1);
//       for (let i = 1; i <= bedroomsCount; i++) {
//         newTasks.push({ id: `bedroom_${i}`, name: `חדר שינה ${i}`, status: 'pending', file: null });
//       }

//       if (rooms % 1 !== 0) {
//         newTasks.push({ id: 'half_room', name: 'חצי חדר / חדר עבודה', status: 'pending', file: null });
//       }

//       if (has_balcony) {
//         newTasks.push({ id: 'balcony', name: 'מרפסת', status: 'pending', file: null });
//       }

//       if (has_storage_room) {
//         newTasks.push({ id: 'storage', name: 'מחסן', status: 'pending', file: null });
//       }

//       setTasks(newTasks);
//     };

//     buildTasks();
//   }, []);

//   // שימוש ב-ChangeEvent המותאם לאלמנט input מסוג HTML
//   const handleFileUpload = (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
//     // ב-TS יש לוודא שהמערך לא ריק/null
//     const file = event.target.files?.[0]; 

//     if (file) {
//       setTasks(prevTasks =>
//         prevTasks.map(task =>
//           task.id === taskId ? { ...task, status: 'uploaded', file: file } : task
//         )
//       );
//     }
//   };

//   const handleSubmit = async () => {
//     setIsUploading(true);
//     console.log("Uploading files to server...", tasks);

//     setTimeout(() => {
//       alert("כל התמונות נשלחו בהצלחה לניתוח AI!");
//       setIsUploading(false);
//     }, 2000);
//   };

//   // בדיקה שגם יש משימות במערך וגם כולן הועלו
//   const allCompleted: boolean = tasks.length > 0 && tasks.every(task => task.status === 'uploaded');

//   return (
//     <div dir="rtl" style={{ fontFamily: 'sans-serif', maxWidth: '450px', margin: '0 auto', padding: '20px' }}>
//       <header style={{ textAlign: 'center', marginBottom: '30px' }}>
//         <h2>אימות נתוני נכס</h2>
//         <p style={{ color: '#666' }}>
//           כדי להשלים את הפקת הפוליסה, אנא צלם את החללים הבאים בהתאם להצהרתך.
//         </p>
//       </header>

//       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//         {tasks.map(task => (
//           <div key={task.id} style={{
//             border: '1px solid #e0e0e0',
//             borderRadius: '10px',
//             padding: '16px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             backgroundColor: task.status === 'uploaded' ? '#f0fdf4' : '#ffffff',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//           }}>
//             <span style={{ fontSize: '16px', fontWeight: '500' }}>{task.name}</span>

//             {task.status === 'uploaded' ? (
//               <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓ צולם</span>
//             ) : (
//               <div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   id={`file-${task.id}`}
//                   style={{ display: 'none' }}
//                   onChange={(e) => handleFileUpload(task.id, e)}
//                 />
//                 <label
//                   htmlFor={`file-${task.id}`}
//                   style={{
//                     backgroundColor: '#2563eb',
//                     color: '#ffffff',
//                     padding: '8px 20px',
//                     borderRadius: '6px',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     fontWeight: 'bold',
//                     display: 'inline-block'
//                   }}
//                 >
//                   למצלמה
//                 </label>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={!allCompleted || isUploading}
//         style={{
//           width: '100%',
//           padding: '16px',
//           marginTop: '30px',
//           backgroundColor: allCompleted && !isUploading ? '#16a34a' : '#d1d5db',
//           color: '#ffffff',
//           border: 'none',
//           borderRadius: '8px',
//           fontSize: '18px',
//           fontWeight: 'bold',
//           cursor: allCompleted && !isUploading ? 'pointer' : 'not-allowed',
//           transition: 'background-color 0.3s'
//         }}
//       >
//         {isUploading ? 'מעבד נתונים...' : 'סיום ושליחה לחיתום'}
//       </button>
//     </div>
//   );
// }






import React, { useState, useEffect, ChangeEvent } from 'react';
// ייבוא הנתונים מהקובץ שלך
import myData from '../data.json';

// === הגדרת טיפוסים מעודכנת ===

interface PropertyCharacteristics {
  rooms: number;
  has_balcony: boolean;
  has_storage_room: boolean;
  bathrooms: number; // הוספנו ספירת אמבטיות
  toilets_count: number;   // הוספנו ספירת שירותים
}

interface SessionData {
  property_characteristics: PropertyCharacteristics;
}

type TaskStatus = 'pending' | 'uploaded';

interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  file: File | null;
}

export default function InsuranceUploadApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    const buildTasks = () => {
      // כאן אנחנו משתמשים ב-myData שהגיע מה-JSON (בהנחה שהוא בפורמט SessionData)
      // אם המבנה ב-JSON מעט שונה, יש להתאים את הנתיב (למשל myData.property_characteristics)
      const data = (myData as SessionData).property_characteristics;
      const { rooms, has_balcony, has_storage_room, bathrooms, toilets_count } = data;

      let newTasks: Task[] = [
        { id: 'living_room', name: 'סלון', status: 'pending', file: null },
        { id: 'kitchen', name: 'מטבח', status: 'pending', file: null }
      ];

      // 1. חישוב חדרי שינה (לפי הלוגיקה שלך: סה"כ חדרים פחות סלון)
      const bedroomsCount = Math.floor(rooms - 1);
      for (let i = 1; i <= bedroomsCount; i++) {
        newTasks.push({ id: `bedroom_${i}`, name: `חדר שינה ${i}`, status: 'pending', file: null });
      }

      // 2. טיפול בחצי חדר
      if (rooms % 1 !== 0) {
        newTasks.push({ id: 'half_room', name: 'חצי חדר / חדר עבודה', status: 'pending', file: null });
      }

      // 3. הוספת אמבטיות (חדרי רחצה) - לולאה דינמית
      for (let i = 1; i <= bathrooms; i++) {
        newTasks.push({ id: `bathroom_${i}`, name: `חדר רחצה / אמבטיה ${i}`, status: 'pending', file: null });
      }

      // 4. הוספת שירותים - לולאה דינמית
      for (let i = 1; i <= toilets_count; i++) {
        newTasks.push({ id: `toilet_${i}`, name: `שירותים ${i}`, status: 'pending', file: null });
      }

      // 5. מרפסת ומחסן
      if (has_balcony) {
        newTasks.push({ id: 'balcony', name: 'מרפסת', status: 'pending', file: null });
      }
      if (has_storage_room) {
        newTasks.push({ id: 'storage', name: 'מחסן', status: 'pending', file: null });
      }

      setTasks(newTasks);
    };

    buildTasks();
  }, []);

  const handleFileUpload = (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (file) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: 'uploaded', file: file } : task
        )
      );
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    // כאן תבוא הלוגיקה של שליחת ה-files שנמצאים בתוך ה-tasks לשרת
    setTimeout(() => {
      alert("כל התמונות נשלחו בהצלחה!");
      setIsUploading(false);
    }, 2000);
  };

  const allCompleted: boolean = tasks.length > 0 && tasks.every(task => task.status === 'uploaded');

  return (
    <div dir="rtl" style={{ fontFamily: 'sans-serif', maxWidth: '450px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>אימות נתוני נכס</h2>
        <p style={{ color: '#666' }}>
          צילומי החללים הנדרשים לפי נתוני ה-JSON:
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map(task => (
          <div key={task.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: task.status === 'uploaded' ? '#f0fdf4' : '#ffffff'
          }}>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>{task.name}</span>
            {task.status === 'uploaded' ? (
              <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓ צולם</span>
            ) : (
              <label htmlFor={`file-${task.id}`} style={{
                backgroundColor: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'
              }}>
                למצלמה
                <input type="file" accept="image/*" capture="environment" id={`file-${task.id}`}
                  style={{ display: 'none' }} onChange={(e) => handleFileUpload(task.id, e)} />
              </label>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={!allCompleted || isUploading} style={{
          width: '100%', padding: '16px', marginTop: '30px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold',
          backgroundColor: allCompleted && !isUploading ? '#16a34a' : '#d1d5db', color: '#fff', cursor: 'pointer'
        }}>
        {isUploading ? 'מעבד נתונים...' : 'סיום ושליחה'}
      </button>
    </div>
  );
}