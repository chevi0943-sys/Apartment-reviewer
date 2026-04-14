// import React, { useState, useEffect, ChangeEvent } from 'react';
// import myData from '../data.json'; // ודא שהנתיב תקין
// import CameraCapture from './CameraCapture';
// // === הטיפוסים שלנו ===
// interface PropertyCharacteristics {
//   rooms: number;
//   has_balcony: boolean;
//   has_storage_room: boolean;
//   bathrooms_count: number;
//   toilets_count: number;
// }

// interface SessionData {
//   property_characteristics: PropertyCharacteristics;
// }

// type TaskStatus = 'pending' | 'analyzing' | 'uploaded' | 'rejected';

// interface Task {
//   id: string;
//   name: string;
//   status: TaskStatus;
//   file: File | null;
//   aiFeedback?: string;
//   allowOverride?: boolean;
// }
// interface Task {
//   id: string;
//   name: string;
//   status: TaskStatus;
//   file: File | null;
//   previewUrl?: string; // <-- הוספנו את השורה הזו
//   aiFeedback?: string;
//   allowOverride?: boolean;
// }
// // === סימולציית שרת ה-AI (נשאר כמו קודם) ===
// const analyzeImageInServer = async (file: File, expectedRoom: string): Promise<{ isValid: boolean, reason?: string }> => {
//   // סימולציה זמנית: מאשרים תמיד כל תמונה באופן מיידי
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ isValid: true });
//     }, 1000); // המתנה של שנייה אחת רק בשביל לראות את האנימציה של ה-AI
//   });
// };

// export default function InsuranceUploadApp() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [showCamera, setShowCamera] = useState<boolean>(false);

//   // === הסטייט החדש לניהול העמודים ===
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   useEffect(() => {
//     const buildTasks = () => {
//       const data = (myData as SessionData).property_characteristics;
//       const { rooms, has_balcony, has_storage_room, bathrooms_count, toilets_count } = data;

//       let newTasks: Task[] = [
//         { id: 'living_room', name: 'סלון', status: 'pending', file: null },
//         { id: 'kitchen', name: 'מטבח', status: 'pending', file: null }
//       ];

//       const bedroomsCount = Math.floor(rooms - 1);
//       for (let i = 1; i <= bedroomsCount; i++) {
//         newTasks.push({ id: `bedroom_${i}`, name: `חדר שינה ${i}`, status: 'pending', file: null });
//       }

//       if (rooms % 1 !== 0) newTasks.push({ id: 'half_room', name: 'חצי חדר', status: 'pending', file: null });
//       for (let i = 1; i <= bathrooms_count; i++) newTasks.push({ id: `bathroom_${i}`, name: `חדר רחצה ${i}`, status: 'pending', file: null });
//       for (let i = 1; i <= toilets_count; i++) newTasks.push({ id: `toilet_${i}`, name: `שירותים ${i}`, status: 'pending', file: null });
//       if (has_balcony) newTasks.push({ id: 'balcony', name: 'מרפסת', status: 'pending', file: null });
//       if (has_storage_room) newTasks.push({ id: 'storage', name: 'מחסן', status: 'pending', file: null });

//       setTasks(newTasks);
//     };

//     buildTasks();
//   }, []);

//   const handlePhotoCaptured = async (taskId: string, file: File) => {
//     setShowCamera(false);

//     const currentTask = tasks.find(t => t.id === taskId);
//     if (!currentTask) return;

//     // יוצרים כתובת לתמונה שצולמה
//     const previewUrl = URL.createObjectURL(file);

//     setTasks(prev => prev.map(t =>
//       t.id === taskId ? { ...t, status: 'analyzing', file: file, previewUrl: previewUrl, aiFeedback: undefined } : t
//     ));

//     try {
//       const aiResponse = await analyzeImageInServer(file, currentTask.name);

//       if (aiResponse.isValid) {
//         setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'uploaded' } : t));

//         setTimeout(() => {
//           if (currentIndex < tasks.length - 1) setCurrentIndex(prev => prev + 1);
//         }, 1500);
//       } else {
//         setTasks(prev => prev.map(t =>
//           t.id === taskId ? { ...t, status: 'rejected', aiFeedback: aiResponse.reason, allowOverride: true } : t
//         ));
//       }
//     } catch (error) {
//       setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'rejected', aiFeedback: 'שגיאת תקשורת' } : t));
//     }
//   };


//   const handleFileUpload = async (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const currentTask = tasks.find(t => t.id === taskId);
//     if (!currentTask) return;

//     // יוצרים כתובת תצוגה מקדימה מיד!
//     const previewUrl = URL.createObjectURL(file);

//     // שומרים את הקובץ והכתובת בסטייט כבר בשלב הניתוח
//     setTasks(prev => prev.map(t =>
//       t.id === taskId ? { ...t, status: 'analyzing', file: file, previewUrl: previewUrl, aiFeedback: undefined } : t
//     ));

//     try {
//       const aiResponse = await analyzeImageInServer(file, currentTask.name);

//       if (aiResponse.isValid) {
//         setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'uploaded' } : t));

//         setTimeout(() => {
//           if (currentIndex < tasks.length - 1) setCurrentIndex(prev => prev + 1);
//         }, 1500);
//       } else {
//         setTasks(prev => prev.map(t =>
//           t.id === taskId ? { ...t, status: 'rejected', aiFeedback: aiResponse.reason, allowOverride: true } : t
//         ));
//       }
//     } catch (error) {
//       setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'rejected', aiFeedback: 'שגיאת תקשורת' } : t));
//     }
//   };




//   const forceApproveTask = (taskId: string) => {
//     setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'uploaded' } : t));
//     // מעבר אוטומטי לשלב הבא
//     setTimeout(() => {
//       if (currentIndex < tasks.length - 1) setCurrentIndex(prev => prev + 1);
//     }, 800);
//   };

//   const handleSubmit = async () => {
//     setIsUploading(true);
//     setTimeout(() => {
//       alert("כל התמונות נשלחו בהצלחה לחיתום!");
//       setIsUploading(false);
//     }, 2000);
//   };

//   // === משתני עזר לתצוגה ===
//   if (tasks.length === 0) return <div>טוען נתונים...</div>; // הגנה לפני שהסטייט מתמלא

//   const currentTask = tasks[currentIndex];
//   const allCompleted = tasks.every(task => task.status === 'uploaded');
//   const progressPercentage = ((currentIndex + 1) / tasks.length) * 100;

//   return (
//     <div dir="rtl" style={{ fontFamily: 'sans-serif', maxWidth: '450px', margin: '0 auto', padding: '20px' }}>

//       {/* === תוספת המצלמה === */}
//       {showCamera && (
//         <CameraCapture
//           onCapture={(file) => handlePhotoCaptured(currentTask.id, file)}
//           onCancel={() => setShowCamera(false)}
//         />
//       )}

//       {/* סרגל התקדמות */}
//       <div style={{ marginBottom: '30px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
//           <span>משימה {currentIndex + 1} מתוך {tasks.length}</span>
//           <span>{Math.round(progressPercentage)}%</span>
//         </div>
//         <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
//           <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.4s ease' }}></div>
//         </div>
//       </div>

//       <header style={{ textAlign: 'center', marginBottom: '30px' }}>
//         <h2>צלם את ה{currentTask.name}</h2>
//         <p style={{ color: '#666' }}>אנא ודא שהחלל מואר היטב וברור בתמונה.</p>
//       </header>

//       {/* תצוגת המשימה המרכזית */}
//       <div style={{
//         border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '30px 20px',
//         textAlign: 'center', backgroundColor: currentTask.status === 'uploaded' ? '#f0fdf4' : '#f8fafc',
//         minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
//       }}>

//         {/* תצוגת תמונה (מופיעה כשיש תמונה - בניתוח, הצלחה או דחייה) */}
//         {currentTask.previewUrl && (
//           <div style={{ width: '100%', height: '200px', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e2e8f0', position: 'relative' }}>
//             <img
//               src={currentTask.previewUrl}
//               alt="תצוגה מקדימה"
//               style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: currentTask.status === 'analyzing' ? 0.6 : 1 }}
//             />

//             {/* אנימציית סריקה בזמן ניתוח */}
//             {currentTask.status === 'analyzing' && (
//               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
//                 <span style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>🤖</span> מנתח...
//               </div>
//             )}
//           </div>
//         )}

//         {/* טקסט סטטוס: אומת */}
//         {/* טקסט סטטוס: אומת + כפתור החלפה */}
//         {currentTask.status === 'uploaded' && (
//           <div style={{ width: '100%' }}>
//             <div style={{
//               color: '#16a34a',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '8px',
//               marginBottom: '15px'
//             }}>
//               <span>✅</span> התמונה אומתה בהצלחה!
//             </div>

//             {/* כפתור החלפת תמונה */}
//             <button
//               onClick={() => {
//                 setTasks(prev => prev.map(t =>
//                   t.id === currentTask.id ? { ...t, status: 'pending', file: null, previewUrl: undefined } : t
//                 ));
//               }}
//               style={{
//                 background: 'none',
//                 border: '1px solid #94a3b8',
//                 color: '#64748b',
//                 padding: '8px 16px',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 transition: 'all 0.2s'
//               }}
//               onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
//               onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//             >
//               🔄 החלף תמונה
//             </button>
//           </div>
//         )}

//         {/* מצב: ממתין או נדחה - כפתורי פעולה */}
//         {(currentTask.status === 'pending' || currentTask.status === 'rejected') && (
//           <>
//             {!currentTask.previewUrl && <div style={{ fontSize: '48px', marginBottom: '15px' }}>📸</div>}

//             <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
//               <button
//                 onClick={() => setShowCamera(true)}
//                 style={{
//                   backgroundColor: currentTask.status === 'rejected' ? '#dc2626' : '#2563eb',
//                   color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', flex: 1, minWidth: '140px'
//                 }}
//               >
//                 {currentTask.status === 'rejected' ? 'צלם מחדש' : 'פתח מצלמה'}
//               </button>

//               <label htmlFor={`file-${currentTask.id}`} style={{
//                 backgroundColor: '#fff', color: '#475569', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', border: '1px solid #cbd5e1', flex: 1, minWidth: '140px'
//               }}>
//                 הגלריה
//                 <input type="file" accept="image/*" id={`file-${currentTask.id}`} style={{ display: 'none' }} onChange={(e) => handleFileUpload(currentTask.id, e)} />
//               </label>
//             </div>
//           </>
//         )}

//         {/* הודעת שגיאה וכפתור עקיפה */}
//         {currentTask.status === 'rejected' && (
//           <div style={{ marginTop: '20px', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', color: '#991b1b', width: '100%', fontSize: '14px' }}>
//             <strong>זיהינו בעיה:</strong> {currentTask.aiFeedback}
//             {currentTask.allowOverride && (
//               <button onClick={() => forceApproveTask(currentTask.id)} style={{
//                 marginTop: '10px', width: '100%', background: 'white', border: '1px solid #991b1b', color: '#991b1b', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
//               }}>
//                 התמונה תקינה, המשך בכל זאת
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* כפתורי ניווט תחתונים */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
//         <button
//           onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
//           disabled={currentIndex === 0 || currentTask.status === 'analyzing'}
//           style={{ padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', opacity: currentIndex === 0 ? 0.5 : 1 }}
//         >
//           הקודם
//         </button>

//         {currentIndex < tasks.length - 1 ? (
//           <button
//             onClick={() => setCurrentIndex(prev => Math.min(tasks.length - 1, prev + 1))}
//             disabled={currentTask.status !== 'uploaded'}
//             style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: currentTask.status === 'uploaded' ? '#2563eb' : '#94a3b8', color: '#fff', cursor: 'pointer' }}
//           >
//             הבא
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={!allCompleted || isUploading}
//             style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: allCompleted ? '#16a34a' : '#94a3b8', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
//           >
//             {isUploading ? 'שולח...' : 'סיום ושליחה'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, LinearProgress,
  Card, CardContent, CardMedia, IconButton, Stack, Alert
} from '@mui/material';
import {
  PhotoCamera, PhotoLibrary, CheckCircle,
  ArrowForward, ArrowBack, Refresh
} from '@mui/icons-material';
import CameraCapture from './CameraCapture';
import myData from '../data.json';

// ... (טיפוסים ופונקציית הסימולציה נשארים אותו דבר)




export default function InsuranceUploadApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(false);

  // ... (useEffect לבניית המשימות נשאר אותו דבר)

  useEffect(() => {
    const buildTasks = () => {
      const data = (myData as SessionData).property_characteristics;
      const { rooms, has_balcony, has_storage_room, bathrooms_count, toilets_count } = data;

      let newTasks: Task[] = [
        { id: 'living_room', name: 'סלון', status: 'pending', file: null },
        { id: 'kitchen', name: 'מטבח', status: 'pending', file: null }
      ];

      const bedroomsCount = Math.floor(rooms - 1);
      for (let i = 1; i <= bedroomsCount; i++) {
        newTasks.push({ id: `bedroom_${i}`, name: `חדר שינה ${i}`, status: 'pending', file: null });
      }

      if (rooms % 1 !== 0) newTasks.push({ id: 'half_room', name: 'חצי חדר', status: 'pending', file: null });
      for (let i = 1; i <= bathrooms_count; i++) newTasks.push({ id: `bathroom_${i}`, name: `חדר רחצה ${i}`, status: 'pending', file: null });
      for (let i = 1; i <= toilets_count; i++) newTasks.push({ id: `toilet_${i}`, name: `שירותים ${i}`, status: 'pending', file: null });
      if (has_balcony) newTasks.push({ id: 'balcony', name: 'מרפסת', status: 'pending', file: null });
      if (has_storage_room) newTasks.push({ id: 'storage', name: 'מחסן', status: 'pending', file: null });

      setTasks(newTasks);
    };

    buildTasks();
  }, []);




  const currentTask = tasks[currentIndex];
  const progressPercentage = tasks.length > 0 ? ((currentIndex + 1) / tasks.length) * 100 : 0;

  if (!currentTask) return <LinearProgress />;

  return (
    <Container maxWidth="xs" sx={{ py: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {showCamera && (
        <CameraCapture
          onCapture={(file) => handlePhotoCaptured(currentTask.id, file)}
          onCancel={() => setShowCamera(false)}
        />
      )}

      {/* סרגל התקדמות MUI */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            משימה {currentIndex + 1} מתוך {tasks.length}
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight="bold">
            {Math.round(progressPercentage)}%
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 5 }} />
      </Box>

      {/* כרטיס המשימה המרכזי */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
        <CardContent sx={{ textAlign: 'center', pt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">
            צלם את ה{currentTask.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            אנא ודא שהחלל מואר היטב וברור
          </Typography>

          {/* אזור התמונה */}
          <Box sx={{
            position: 'relative', height: 240, borderRadius: 3, bgcolor: 'grey.100',
            border: '2px dashed', borderColor: currentTask.status === 'uploaded' ? 'success.light' : 'grey.300',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
          }}>
            {currentTask.previewUrl ? (
              <>
                <CardMedia
                  component="img"
                  image={currentTask.previewUrl}
                  sx={{ height: '100%', width: '100%', objectFit: 'cover', opacity: currentTask.status === 'analyzing' ? 0.5 : 1 }}
                />
                {currentTask.status === 'analyzing' && (
                  <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white', px: 2, py: 1, borderRadius: 5 }}>
                      🤖 מנתח...
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <PhotoCamera sx={{ fontSize: 60, color: 'grey.300' }} />
            )}
          </Box>

          {/* כפתורי פעולה */}
          <Box sx={{ mt: 3 }}>
            {currentTask.status === 'uploaded' ? (
              <Stack alignItems="center" spacing={1}>
                <Typography color="success.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle /> אומת בהצלחה
                </Typography>
                <Button startIcon={<Refresh />} size="small" onClick={() => resetTask(currentTask.id)}>
                  צילום מחדש
                </Button>
              </Stack>
            ) : currentTask.status !== 'analyzing' ? (
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth variant="contained" startIcon={<PhotoCamera />}
                  onClick={() => setShowCamera(true)}
                  sx={{ borderRadius: 3, py: 1.5 }}
                >
                  צלם
                </Button>
                <Button
                  fullWidth variant="outlined" component="label" startIcon={<PhotoLibrary />}
                  sx={{ borderRadius: 3, py: 1.5 }}
                >
                  גלריה
                  <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(currentTask.id, e)} />
                </Button>
              </Stack>
            ) : null}
          </Box>
        </CardContent>
      </Card>

      {/* ניווט תחתון */}
      <Stack direction="row" justifyContent="space-between" mt="auto" pt={4}>
        <Button
          startIcon={<ArrowForward />} onClick={() => setCurrentIndex(prev => prev - 1)}
          disabled={currentIndex === 0 || currentTask.status === 'analyzing'}
        >
          הקודם
        </Button>

        {currentIndex < tasks.length - 1 ? (
          <Button
            endIcon={<ArrowBack />} variant="contained" color="inherit"
            onClick={() => setCurrentIndex(prev => prev + 1)}
            disabled={currentTask.status !== 'uploaded'}
            sx={{ borderRadius: 2 }}
          >
            הבא
          </Button>
        ) : (
          <Button
            variant="contained" color="success" onClick={handleSubmit}
            disabled={!tasks.every(t => t.status === 'uploaded')}
            sx={{ borderRadius: 2, px: 4 }}
          >
            סיום ושליחה
          </Button>
        )}
      </Stack>
    </Container>
  );
}