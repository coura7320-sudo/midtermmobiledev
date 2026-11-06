export interface ContactData {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  online: boolean;
}

export const CONTACTS_DATA: ContactData[] = [
  {
    id: 'c1',
    name: 'Prof. Diop (Mobile Dev)',
    phone: '+221 77 987 65 43',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    about: 'Available for midterm presentations. Good luck students!',
    online: true,
  },
  {
    id: 'c2',
    name: 'Fatou Ndiaye',
    phone: '+221 78 456 12 34',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    about: 'Coding React Native 📱✨',
    online: true,
  },
  {
    id: 'c3',
    name: 'Moussa Sow',
    phone: '+221 76 321 98 76',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    about: 'Busy working on CS assignments',
    online: false,
  },
  {
    id: 'c4',
    name: 'Amina Ba',
    phone: '+221 70 888 22 11',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    about: 'Always smiling 😊',
    online: false,
  },
  {
    id: 'c5',
    name: 'DAUST CS Mobile Dev Class 🎓',
    phone: 'Groupe (24 participants)',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
    about: 'Official group for Mobile Dev midterm project and labs',
    online: true,
  },
];
