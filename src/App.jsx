import React, { useState, useEffect } from 'react';
import { MapPin, X, Trash2, Heart, Share2, Check, Link as LinkIcon, Plus } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-muC6wJJLbZsT5LFfyZn0eBKeL_862Qc",
  authDomain: "my-photo-map-337f0.firebaseapp.com",
  projectId: "my-photo-map-337f0",
  storageBucket: "my-photo-map-337f0.firebasestorage.app",
  messagingSenderId: "4782557016",
  appId: "1:4782557016:web:17c1ea6a9a1e25b8be872d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "my-photo-map-337f0";

const PREFECTURES = [
  { id: 'hokkaido', name: '北海道', x: 14, y: 1, color: '#FAD2E1' },
  { id: 'aomori', name: '青森', x: 14, y: 2, color: '#BEE1E6' },
  { id: 'akita', name: '秋田', x: 13, y: 3, color: '#BEE1E6' },
  { id: 'iwate', name: '岩手', x: 14, y: 3, color: '#BEE1E6' },
  { id: 'yamagata', name: '山形', x: 13, y: 4, color: '#BEE1E6' },
  { id: 'miyagi', name: '宮城', x: 14, y: 4, color: '#BEE1E6' },
  { id: 'fukushima', name: '福島', x: 14, y: 5, color: '#BEE1E6' },
  { id: 'gunma', name: '群馬', x: 12, y: 6, color: '#E2ECE9' },
  { id: 'tochigi', name: '栃木', x: 13, y: 6, color: '#E2ECE9' },
  { id: 'ibaraki', name: '茨城', x: 14, y: 6, color: '#E2ECE9' },
  { id: 'saitama', name: '埼玉', x: 13, y: 7, color: '#E2ECE9' },
  { id: 'chiba', name: '千葉', x: 14, y: 7, color: '#E2ECE9' },
  { id: 'tokyo', name: '東京', x: 13, y: 8, color: '#E2ECE9' },
  { id: 'kanagawa', name: '神奈川', x: 13, y: 9, color: '#E2ECE9' },
  { id: 'niigata', name: '新潟', x: 12, y: 5, color: '#FDE2E4' },
  { id: 'toyama', name: '富山', x: 11, y: 5, color: '#FDE2E4' },
  { id: 'ishikawa', name: '石川', x: 10, y: 5, color: '#FDE2E4' },
  { id: 'fukui', name: '福井', x: 9, y: 5, color: '#FDE2E4' },
  { id: 'nagano', name: '長野', x: 11, y: 6, color: '#FDE2E4' },
  { id: 'gifu', name: '岐阜', x: 10, y: 6, color: '#FDE2E4' },
  { id: 'yamanashi', name: '山梨', x: 12, y: 7, color: '#FDE2E4' },
  { id: 'aichi', name: '愛知', x: 11, y: 8, color: '#FDE2E4' },
  { id: 'shizuoka', name: '静岡', x: 12, y: 8, color: '#FDE2E4' },
  { id: 'shiga', name: '滋賀', x: 9, y: 6, color: '#DFE7FD' },
  { id: 'kyoto', name: '京都', x: 8, y: 6, color: '#DFE7FD' },
  { id: 'hyogo', name: '兵庫', x: 7, y: 6, color: '#DFE7FD' },
  { id: 'mie', name: '三重', x: 10, y: 7, color: '#DFE7FD' },
  { id: 'nara', name: '奈良', x: 9, y: 7, color: '#DFE7FD' },
  { id: 'osaka', name: '大阪', x: 8, y: 7, color: '#DFE7FD' },
  { id: 'wakayama', name: '和歌山', x: 8, y: 8, color: '#DFE7FD' },
  { id: 'tottori', name: '鳥取', x: 6, y: 6, color: '#FFE5D9' },
  { id: 'shimane', name: '島根', x: 5, y: 6, color: '#FFE5D9' },
  { id: 'okayama', name: '岡山', x: 6, y: 7, color: '#FFE5D9' },
  { id: 'hiroshima', name: '広島', x: 5, y: 7, color: '#FFE5D9' },
  { id: 'yamaguchi', name: '山口', x: 4, y: 7, color: '#FFE5D9' },
  { id: 'kagawa', name: '香川', x: 6, y: 9, color: '#D8E2DC' },
  { id: 'tokushima', name: '徳島', x: 7, y: 9, color: '#D8E2DC' },
  { id: 'ehime', name: '愛媛', x: 5, y: 9, color: '#D8E2DC' },
  { id: 'kochi', name: '高知', x: 6, y: 10, color: '#D8E2DC' },
  { id: 'fukuoka', name: '福岡', x: 3, y: 7, color: '#FFD7BA' },
  { id: 'saga', name: '佐賀', x: 2, y: 7, color: '#FFD7BA' },
  { id: 'nagasaki', name: '長崎', x: 1, y: 7, color: '#FFD7BA' },
  { id: 'oita', name: '大分', x: 3, y: 8, color: '#FFD7BA' },
  { id: 'kumamoto', name: '熊本', x: 2, y: 8, color: '#FFD7BA' },
  { id: 'miyazaki', name: '宮崎', x: 3, y: 9, color: '#FFD7BA' },
  { id: 'kagoshima', name: '鹿児島', x: 2, y: 9, color: '#FFD7BA' },
  { id: 'okinawa', name: '沖縄', x: 1, y: 11, color: '#FCD5CE' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState({});
  const [selectedPref, setSelectedPref] = useState(null);
  const [copied, setCopied] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [inputUrl, setInputUrl] = useState('');

  useEffect(() => {
    signInAnonymously(auth).catch(e => console.error("Auth error:", e));
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      const params = new URLSearchParams(window.location.search);
      const targetUid = params.get('user');
      setViewingUserId(targetUid || u?.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!viewingUserId || !user) return;
    const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'maps', viewingUserId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) setMemories(docSnap.data().map || {});
      else setMemories({});
    }, (error) => console.error("Snapshot error:", error));
    return () => unsubscribe();
  }, [viewingUserId, user]);

  const isEditable = user && viewingUserId && user.uid === viewingUserId;

  const saveToCloud = async (newMemories) => {
    if (!isEditable || !user) return;
    try {
      const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'maps', user.uid);
      await setDoc(userDocRef, { map: newMemories }, { merge: true });
    } catch (error) {
      console.error("Save error:", error);
      alert("保存に失敗しました。");
    }
  };

  const addPhotoByUrl = async () => {
    if (!inputUrl || !selectedPref) return;
    const newPhoto = {
      id: Date.now(),
      url: inputUrl,
      date: new Date().toLocaleDateString('ja-JP'),
      rotate: Math.random() * 6 - 3
    };
    const updatedMemories = { ...memories, [selectedPref.id]: [newPhoto, ...(memories[selectedPref.id] || [])] };
    setMemories(updatedMemories);
    await saveToCloud(updatedMemories);
    setInputUrl('');
  };

  const deletePhoto = (prefId, photoId) => {
    if (!isEditable || !window.confirm("この写真を削除しますか？")) return;
    const updatedPrefPhotos = (memories[prefId] || []).filter(p => p.id !== photoId);
    const updatedMemories = { ...memories };
    if (updatedPrefPhotos.length === 0) delete updatedMemories[prefId];
    else updatedMemories[prefId] = updatedPrefPhotos;
    setMemories(updatedMemories);
    saveToCloud(updatedMemories);
  };

  const copyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('user', user.uid);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-stone-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#5D574E] p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-stone-700">思い出フォトマップ</h1>
        {isEditable && (
          <button onClick={copyShareLink} className="mt-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-500 shadow-sm mx-auto">
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
            {copied ? "URLコピー完了！" : "共有用URLをコピー"}
          </button>
        )}
      </header>

      <main className="max-w-5xl mx-auto bg-white/60 p-6 md:p-10 rounded-[3rem] shadow-xl border-2 border-stone-100 overflow-x-auto">
        <div className="min-w-[800px] grid gap-2" style={{ gridTemplateColumns: 'repeat(14, 1fr)', gridTemplateRows: 'repeat(11, 1fr)' }}>
          {PREFECTURES.map(pref => {
            const photos = memories[pref.id] || [];
            return (
              <div key={pref.id} onClick={() => setSelectedPref(pref)} className="aspect-square rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-sm border border-white relative" style={{ gridColumn: pref.x, gridRow: pref.y, backgroundColor: pref.color }}>
                {photos.length > 0 ? (
                  <div className="absolute inset-0 p-1">
                    <img src={photos[0].url} className="w-full h-full object-cover rounded-lg" alt="" onError={(e) => { e.target.src = "https://placehold.jp/24/cccccc/ffffff/100x100.png?text=!"; }} />
                  </div>
                ) : <span className="text-[10px] font-bold text-stone-600/40">{pref.name}</span>}
              </div>
            );
          })}
        </div>
      </main>

      {selectedPref && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40" onClick={() => setSelectedPref(null)}>
          <div className="bg-[#FDFBF7] w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] relative overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center bg-white/50">
              <h2 className="text-2xl font-bold text-stone-700">{selectedPref.name}のアルバム</h2>
              <button onClick={() => setSelectedPref(null)}><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {isEditable && (
                <div className="mb-8 p-4 bg-white rounded-2xl border border-stone-100 flex gap-2">
                  <input type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="画像URLを貼り付け" className="flex-1 px-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none" />
                  <button onClick={addPhotoByUrl} className="bg-rose-400 text-white px-4 py-2 rounded-xl font-bold text-sm"><Plus size={18} /></button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                {memories[selectedPref.id]?.map(photo => (
                  <div key={photo.id} className="bg-white p-2 pb-6 shadow-lg relative" style={{ transform: `rotate(${photo.rotate}deg)` }}>
                    <img src={photo.url} className="w-full aspect-square object-cover" alt="" />
                    {isEditable && <button onClick={() => deletePhoto(selectedPref.id, photo.id)} className="absolute bottom-1 right-1 text-rose-300"><Trash2 size={14} /></button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}