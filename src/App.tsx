import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  Sparkles, 
  MapPin, 
  RotateCcw, 
  Check, 
  Shuffle, 
  History, 
  Heart, 
  Info, 
  X, 
  Flame, 
  Coffee, 
  Compass, 
  HelpCircle, 
  Star, 
  Sliders, 
  Search, 
  Copy, 
  CheckCircle2, 
  Dices,
  AlertCircle,
  ThumbsUp,
  Volume2,
  VolumeX,
  PlusCircle,
  TrendingUp,
  Tag,
  Globe,
  IndianRupee,
  Map as MapIcon
} from 'lucide-react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker, 
  Pin as GooglePin, 
  InfoWindow as GoogleInfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { Restaurant, ChoiceHistory } from './types';
import LeafletMap from './components/LeafletMap';

// Authentic legendary curated spots located in Mumbai with accurate coordinates, prices, ratings & categories!
const DEFAULT_RESTAURANTS: Restaurant[] = [
  // ── ORIGINAL 25 ──────────────────────────────────────────────────────────
  { id: '1', name: 'Ram Ashray (Matunga) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0274, longitude: 72.8517, address: 'Bhandarkar Road, Matunga East, Mumbai', rating: 4.5, color: 'emerald' },
  { id: '2', name: 'Bademiya (Colaba) 🍢', active: true, craving: true, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹₹', latitude: 18.9242, longitude: 72.8332, address: 'Tulloch Road, behind Taj Mahal Palace, Colaba, Mumbai', rating: 4.1, color: 'orange' },
  { id: '3', name: 'Elco Pani Puri (Bandra) 🥤', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0583, longitude: 72.8340, address: 'Hill Road, Bandra West, Mumbai', rating: 4.2, color: 'rose' },
  { id: '4', name: 'Bhagat Tarachand (Zaveri Bazar) 🥦', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9547, longitude: 72.8315, address: 'Shaikh Memon St, Zaveri Bazar, Mumbai', rating: 4.3, color: 'yellow' },
  { id: '5', name: 'Ling\'s Pavilion (Colaba) 🍜', active: true, craving: false, category: 'Indo-Chinese', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9248, longitude: 72.8322, address: 'Landsdowne Road, Colaba, Mumbai', rating: 4.4, color: 'indigo' },
  { id: '6', name: 'Joey\'s Pizza (Andheri) 🍕', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.1254, longitude: 72.8310, address: 'Samartha Aishwarya, Andheri West, Mumbai', rating: 4.6, color: 'amber' },
  { id: '7', name: 'Gajalee (Vile Parle) 🍲', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.1009, longitude: 72.8425, address: 'Hanuman Road, Vile Parle East, Mumbai', rating: 4.5, color: 'sky' },
  { id: '8', name: 'Kyani & Co. (Marine Lines) ☕', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9431, longitude: 72.8256, address: 'JSS Road, Metro Junction, Marine Lines, Mumbai', rating: 4.3, color: 'stone' },
  { id: '9', name: 'Taj Mahal Tea House (Bandra) 🍵', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹₹', latitude: 19.0536, longitude: 72.8248, address: 'St John Baptist Road, Bandra West, Mumbai', rating: 4.5, color: 'emerald' },
  { id: '10', name: 'Khyber (Fort) 🏛️', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9304, longitude: 72.8327, address: 'M.G. Road, Kala Ghoda, Fort, Mumbai', rating: 4.4, color: 'orange' },
  { id: '11', name: 'Britannia & Co. (Fort) 🍛', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹₹', latitude: 18.9372, longitude: 72.8385, address: 'Wakefield House, Ballard Estate, Fort, Mumbai', rating: 4.3, color: 'rose' },
  { id: '12', name: 'Amar Juice Centre (Vile Parle) 🧈', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1062, longitude: 72.8375, address: 'Gulmohar Road, Juhu Scheme, Vile Parle West, Mumbai', rating: 4.1, color: 'yellow' },
  { id: '13', name: 'Theobroma (Bandra) 🧁', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.0592, longitude: 72.8301, address: 'Link Square Mall, Bandra West, Mumbai', rating: 4.3, color: 'pink' },
  { id: '14', name: 'Lucky Biryani (Bandra) 🍚', active: true, craving: false, category: 'Biryani', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0565, longitude: 72.8402, address: 'SV Road, Bandra West, Mumbai', rating: 4.2, color: 'red' },
  { id: '15', name: 'Prithvi Cafe (Juhu) 🎭', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹', latitude: 19.1058, longitude: 72.8258, address: 'Janki Kutir, Juhu Church Road, Mumbai', rating: 4.5, color: 'stone' },
  { id: '16', name: 'Wasabi by Morimoto (Colaba) 🍣', active: true, craving: false, category: 'Japanese & Sushi', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9218, longitude: 72.8330, address: 'Taj Mahal Palace, Colaba, Mumbai', rating: 4.7, color: 'indigo' },
  { id: '17', name: 'Cafe Madras (Kings Circle) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0270, longitude: 72.8554, address: 'Bhaudaji Road, Kings Circle, Matunga, Mumbai', rating: 4.5, color: 'emerald' },
  { id: '18', name: 'Swati Snacks (Tardeo) 🥣', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9654, longitude: 72.8130, address: 'Tardeo Road, opp. Bhatia Hospital, Mumbai', rating: 4.4, color: 'yellow' },
  { id: '19', name: 'Yauatcha (BKC) 🥟', active: true, craving: false, category: 'Indo-Chinese', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0664, longitude: 72.8615, address: 'Bandra Kurla Complex, Bandra East, Mumbai', rating: 4.5, color: 'indigo' },
  { id: '20', name: 'Subko Coffee Packers (Bandra) ☕', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.0524, longitude: 72.8298, address: 'Chapel Road, Ranwar, Bandra West, Mumbai', rating: 4.6, color: 'stone' },
  { id: '21', name: 'Gulshan-e-Iran (Crawford Market) 🍗', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Casual Dining', priceRange: '₹', latitude: 18.9482, longitude: 72.8335, address: 'Crawford Market, Fort, Mumbai', rating: 4.2, color: 'red' },
  { id: '22', name: 'Jimmy Boy (Fort) 🥞', active: true, craving: false, category: 'Irani Cafe', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9320, longitude: 72.8332, address: 'Vikas Building, Bank Street, Fort, Mumbai', rating: 4.3, color: 'rose' },
  { id: '23', name: 'Sardar Pav Bhaji (Tardeo) 🧈', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9691, longitude: 72.8152, address: 'Tardeo Road Junction, Mumbai', rating: 4.0, color: 'orange' },
  { id: '24', name: 'Bastian (Bandra) 🦞', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0579, longitude: 72.8358, address: 'Linking Road, Bandra West, Mumbai', rating: 4.3, color: 'sky' },
  { id: '25', name: 'K. Rustom & Co. (Churchgate) 🍦', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9312, longitude: 72.8242, address: 'Veer Nariman Road, Churchgate, Mumbai', rating: 4.6, color: 'pink' },

  // ── STREET FOOD LEGENDS ───────────────────────────────────────────────────
  { id: '26', name: 'Juhu Beach Bhutta Stalls 🌽', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0964, longitude: 72.8265, address: 'Juhu Beach Promenade, Juhu, Mumbai', rating: 4.0, color: 'yellow' },
  { id: '27', name: 'Haji Ali Juice Centre 🥭', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9825, longitude: 72.8090, address: 'Lala Lajpat Rai Road, Haji Ali, Mumbai', rating: 4.4, color: 'amber' },
  { id: '28', name: 'Chowpatty Bhelpuri Stalls 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9548, longitude: 72.8148, address: 'Girgaon Chowpatty Beach, Marine Drive, Mumbai', rating: 4.2, color: 'rose' },
  { id: '29', name: 'Vithal\'s Vada Pav (Dadar) 🍔', active: true, craving: true, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0178, longitude: 72.8478, address: 'Dadar TT Circle, Dadar West, Mumbai', rating: 4.3, color: 'orange' },
  { id: '30', name: 'Gajanan Vada Pav (Dadar) 🥔', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0200, longitude: 72.8440, address: 'Near Dadar Station West, Dadar, Mumbai', rating: 4.1, color: 'amber' },
  { id: '31', name: 'Mohammed Ali Road Stalls 🌙', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9523, longitude: 72.8364, address: 'Mohammed Ali Road, Bhendi Bazar, Mumbai', rating: 4.5, color: 'red' },
  { id: '32', name: 'Suresh Lunch Home (Chembur) 🦀', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0625, longitude: 72.8991, address: 'R.C. Marg, Chembur, Mumbai', rating: 4.4, color: 'sky' },
  { id: '33', name: 'Ashok Vada Pav (Kirti College) 🥔', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0414, longitude: 72.8357, address: 'Kirti College Road, Dadar West, Mumbai', rating: 4.2, color: 'orange' },
  { id: '34', name: 'Kailash Parbat (Colaba) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9222, longitude: 72.8313, address: 'Sheela Mahal, 1st Pasta Lane, Colaba, Mumbai', rating: 4.3, color: 'green' },
  { id: '35', name: 'Badshah Cold Drinks (Crawford) 🧃', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9477, longitude: 72.8342, address: 'Lokmanya Tilak Road, opp. Crawford Market, Mumbai', rating: 4.2, color: 'yellow' },
  { id: '36', name: 'Candies (Bandra) 🧇', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.0625, longitude: 72.8261, address: 'Pali Hill Road, Bandra West, Mumbai', rating: 4.1, color: 'pink' },
  { id: '37', name: 'Soam (Babulnath) 🥣', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9589, longitude: 72.8097, address: 'Babulnath Road, Chowpatty, Mumbai', rating: 4.5, color: 'emerald' },
  { id: '38', name: 'Raju Sandwich (Bandra) 🥪', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0542, longitude: 72.8370, address: 'Turner Road, Bandra West, Mumbai', rating: 4.0, color: 'green' },

  // ── ICONIC CAFES & COFFEE ─────────────────────────────────────────────────
  { id: '39', name: 'Blue Tokai Coffee (Bandra) ☕', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.0554, longitude: 72.8310, address: 'Linking Road, Bandra West, Mumbai', rating: 4.5, color: 'stone' },
  { id: '40', name: 'The Bagel Shop (Bandra) 🥯', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.0595, longitude: 72.8272, address: 'Pali Naka, Bandra West, Mumbai', rating: 4.3, color: 'amber' },
  { id: '41', name: 'Bombay Coffee House (Colaba) ☕', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 18.9228, longitude: 72.8316, address: 'Colaba Causeway, Colaba, Mumbai', rating: 4.2, color: 'stone' },
  { id: '42', name: 'Kala Ghoda Cafe (Fort) 🎨', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 18.9295, longitude: 72.8316, address: 'Ropewalk Lane, Kala Ghoda, Fort, Mumbai', rating: 4.4, color: 'indigo' },
  { id: '43', name: 'Cafe Leopold (Colaba) 🍺', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9236, longitude: 72.8315, address: 'Colaba Causeway, Colaba, Mumbai', rating: 4.0, color: 'amber' },
  { id: '44', name: 'Stir (Powai) ☕', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.1174, longitude: 72.9060, address: 'Hiranandani Gardens, Powai, Mumbai', rating: 4.3, color: 'rose' },
  { id: '45', name: 'Deja Brew (Andheri) 🧋', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.1192, longitude: 72.8468, address: 'Andheri West, Mumbai', rating: 4.2, color: 'stone' },
  { id: '46', name: 'Perch Wine & Coffee Bar (Bandra) 🍷', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0604, longitude: 72.8307, address: 'Sterling Apartments, Pali Hill, Bandra West, Mumbai', rating: 4.4, color: 'indigo' },
  { id: '47', name: 'Worli Sea Face Stalls 🌊', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0069, longitude: 72.8174, address: 'Dr Annie Besant Road, Worli Sea Face, Mumbai', rating: 4.0, color: 'sky' },

  // ── REGIONAL & SPECIALTY ──────────────────────────────────────────────────
  { id: '48', name: 'Shalimar (Bhendi Bazar) 🍖', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9519, longitude: 72.8371, address: 'Clare Road, Bhendi Bazar, Mumbai', rating: 4.5, color: 'red' },
  { id: '49', name: 'Danda (Khar) 🍝', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0710, longitude: 72.8330, address: 'Linking Road, Khar West, Mumbai', rating: 4.3, color: 'amber' },
  { id: '50', name: 'Culture (Bandra) 🥗', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹₹', latitude: 19.0551, longitude: 72.8280, address: 'Chapel Road, Bandra West, Mumbai', rating: 4.5, color: 'emerald' },
  { id: '51', name: 'Hotel Deluxe (Matunga) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0283, longitude: 72.8505, address: 'King\'s Circle, Matunga West, Mumbai', rating: 4.4, color: 'emerald' },
  { id: '52', name: 'Saraswat Bhavan (Borivali) 🥥', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.2309, longitude: 72.8567, address: 'S.V. Road, Borivali West, Mumbai', rating: 4.2, color: 'green' },
  { id: '53', name: 'Paradise (Santacruz) 🍚', active: true, craving: false, category: 'Biryani', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0827, longitude: 72.8408, address: 'Linking Road, Santacruz West, Mumbai', rating: 4.3, color: 'red' },
  { id: '54', name: 'Delhi Darbar (Colaba) 🍛', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9246, longitude: 72.8318, address: 'Colaba Causeway, Colaba, Mumbai', rating: 4.1, color: 'yellow' },
  { id: '55', name: 'Copper Chimney (Worli) 🫕', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0143, longitude: 72.8183, address: 'Dr Annie Besant Road, Worli, Mumbai', rating: 4.3, color: 'orange' },
  { id: '56', name: 'Trishna (Fort) 🦀', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9298, longitude: 72.8337, address: 'Rope Walk Lane, Kala Ghoda, Fort, Mumbai', rating: 4.6, color: 'sky' },
  { id: '57', name: 'Apoorva (Fort) 🐟', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9334, longitude: 72.8352, address: 'Noble Chambers, Henry Mello Road, Fort, Mumbai', rating: 4.3, color: 'sky' },
  { id: '58', name: 'Revival (Churchgate) 🍃', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 18.9353, longitude: 72.8258, address: 'Veer Nariman Road, Churchgate, Mumbai', rating: 4.2, color: 'green' },
  { id: '59', name: 'Rajdhani Thali (Lower Parel) 🍽️', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9963, longitude: 72.8302, address: 'High Street Phoenix, Lower Parel, Mumbai', rating: 4.2, color: 'yellow' },
  { id: '60', name: 'Peshawri (ITC Maratha, Andheri) 🥩', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0997, longitude: 72.8693, address: 'ITC Maratha, Sahar Road, Andheri East, Mumbai', rating: 4.7, color: 'red' },

  // ── DESSERTS & MITHAI ─────────────────────────────────────────────────────
  { id: '61', name: 'Ghasitaram\'s (Kalbadevi) 🍮', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9503, longitude: 72.8292, address: 'Kalbadevi Road, Mumbai', rating: 4.3, color: 'pink' },
  { id: '62', name: 'Prakash (Dadar) 🍯', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0193, longitude: 72.8452, address: 'Gokhale Road North, Dadar West, Mumbai', rating: 4.4, color: 'amber' },
  { id: '63', name: 'Sukh Sagar (Churchgate) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹', latitude: 18.9339, longitude: 72.8259, address: 'Marine Drive, Churchgate, Mumbai', rating: 4.1, color: 'rose' },
  { id: '64', name: 'New Kulfi Centre (Chowpatty) 🍦', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9554, longitude: 72.8148, address: 'Girgaon Chowpatty, Mumbai', rating: 4.4, color: 'pink' },
  { id: '65', name: 'Cream Centre (Chowpatty) 🧀', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9561, longitude: 72.8143, address: 'Chowpatty Sea Face, Mumbai', rating: 4.2, color: 'yellow' },
  { id: '66', name: 'Gulab (Bandra) 🌹', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.0601, longitude: 72.8360, address: 'Hill Road, Bandra West, Mumbai', rating: 4.3, color: 'rose' },

  // ── NEIGHBOURHOOD GEMS ───────────────────────────────────────────────────
  { id: '67', name: 'Shree Thaker Bhojanalay (Kalbadevi) 🍱', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9509, longitude: 72.8277, address: 'Dadisheth Agiary Lane, Kalbadevi, Mumbai', rating: 4.5, color: 'yellow' },
  { id: '68', name: 'Arya Bhavan (Matunga) 🥬', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0277, longitude: 72.8499, address: 'Telang Road, Matunga West, Mumbai', rating: 4.4, color: 'emerald' },
  { id: '69', name: 'Sindhudurg (Dadar) 🦑', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0203, longitude: 72.8458, address: 'Gokhale Road, Dadar West, Mumbai', rating: 4.3, color: 'sky' },
  { id: '70', name: 'Mahesh Lunch Home (Fort) 🦐', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9318, longitude: 72.8342, address: 'Cawasji Patel Street, Fort, Mumbai', rating: 4.4, color: 'sky' },
  { id: '71', name: 'Cafe Noorani (Haji Ali) 🍜', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9827, longitude: 72.8093, address: 'Tardeo Road, Haji Ali, Mumbai', rating: 4.2, color: 'red' },
  { id: '72', name: 'Rajwada (Borivali) 🫕', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.2283, longitude: 72.8555, address: 'S.V. Road, Borivali West, Mumbai', rating: 4.2, color: 'orange' },
  { id: '73', name: 'Hitchki (Powai) 🍻', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹₹', latitude: 19.1187, longitude: 72.9058, address: 'Powai Plaza, Hiranandani, Powai, Mumbai', rating: 4.3, color: 'amber' },
  { id: '74', name: 'Burma Burma (Fort) 🍜', active: true, craving: false, category: 'Indo-Chinese', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9296, longitude: 72.8320, address: 'Ropewalk Lane, Kala Ghoda, Fort, Mumbai', rating: 4.5, color: 'indigo' },
  { id: '75', name: 'Bhaji Pala (Juhu) 🥬', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1072, longitude: 72.8262, address: 'Juhu Tara Road, Juhu, Mumbai', rating: 4.0, color: 'green' },
  { id: '76', name: 'Suzette (Bandra) 🥙', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.0592, longitude: 72.8285, address: 'Chapel Road, Bandra West, Mumbai', rating: 4.4, color: 'rose' },
  { id: '77', name: 'Mirchi & Mime (Powai) 🍛', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.1167, longitude: 72.9048, address: 'Hiranandani Gardens, Powai, Mumbai', rating: 4.6, color: 'orange' },
  { id: '78', name: 'Cafe Zoe (Lower Parel) 🎷', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 18.9975, longitude: 72.8290, address: 'Mathurdas Mill Compound, Lower Parel, Mumbai', rating: 4.3, color: 'indigo' },
  { id: '79', name: 'Bayroute (Juhu) 🫒', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.1062, longitude: 72.8270, address: 'Juhu Tara Road, Juhu, Mumbai', rating: 4.5, color: 'amber' },
  { id: '80', name: 'Masala Library (BKC) 🔬', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0676, longitude: 72.8627, address: 'First International Financial Centre, BKC, Mumbai', rating: 4.6, color: 'indigo' },

  // ── BIRYANI SPECIALISTS (was only 2!) ────────────────────────────────────
  { id: '81', name: 'Jaffer Bhai\'s Delhi Darbar (Kurla) 🍚', active: true, craving: false, category: 'Biryani', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0728, longitude: 72.8826, address: 'L.B.S. Road, Kurla West, Mumbai', rating: 4.4, color: 'red' },
  { id: '82', name: 'Noor Mohammadi Hotel (Bhendi Bazar) 🍚', active: true, craving: false, category: 'Biryani', ambience: 'Casual Dining', priceRange: '₹', latitude: 18.9516, longitude: 72.8367, address: 'Bhendi Bazar, Mumbai', rating: 4.5, color: 'red' },
  { id: '83', name: 'Hyderabadi Biryani House (Andheri) 🍚', active: true, craving: false, category: 'Biryani', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.1196, longitude: 72.8468, address: 'S.V. Road, Andheri West, Mumbai', rating: 4.2, color: 'orange' },
  { id: '84', name: 'Cafe Irani Chaii (Versova) 🍚', active: true, craving: false, category: 'Biryani', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 19.1309, longitude: 72.8157, address: 'Versova, Andheri West, Mumbai', rating: 4.3, color: 'amber' },
  { id: '85', name: 'Dum Pukht Biryani (Malad) 🍚', active: true, craving: false, category: 'Biryani', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.1863, longitude: 72.8484, address: 'S.V. Road, Malad West, Mumbai', rating: 4.1, color: 'red' },

  // ── IRANI CAFE VIBE (was only 3!) ─────────────────────────────────────────
  { id: '86', name: 'Sassanian Boulangerie (Dhobi Talao) 🥐', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9453, longitude: 72.8288, address: 'Dhobi Talao, Mumbai', rating: 4.4, color: 'stone' },
  { id: '87', name: 'Cafe Military (Fort) ☕', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9336, longitude: 72.8351, address: 'Horniman Circle, Fort, Mumbai', rating: 4.3, color: 'stone' },
  { id: '88', name: 'Ideal Corner (Fort) 🥚', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9322, longitude: 72.8345, address: 'F/12 Hornby View, Gunbow St, Fort, Mumbai', rating: 4.5, color: 'amber' },
  { id: '89', name: 'Merwan & Co. (Grant Road) ☕', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9645, longitude: 72.8196, address: 'Grant Road Station West, Mumbai', rating: 4.2, color: 'stone' },

  // ── PIZZA & PASTA (was only 2!) ───────────────────────────────────────────
  { id: '90', name: 'Woodside Inn (Colaba) 🍕', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9225, longitude: 72.8311, address: 'Woodhouse Road, Colaba, Mumbai', rating: 4.3, color: 'amber' },
  { id: '91', name: 'Uno Chicago Bar & Grill (Juhu) 🍕', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.1067, longitude: 72.8272, address: 'Juhu Tara Road, Juhu, Mumbai', rating: 4.1, color: 'red' },
  { id: '92', name: 'La Folie (Santacruz) 🍫', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Cozy Cafe', priceRange: '₹₹₹', latitude: 19.0831, longitude: 72.8400, address: 'Linking Road, Santacruz West, Mumbai', rating: 4.5, color: 'indigo' },
  { id: '93', name: 'Shizusan (Lower Parel) 🥢', active: true, craving: false, category: 'Japanese & Sushi', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9995, longitude: 72.8311, address: 'High Street Phoenix, Lower Parel, Mumbai', rating: 4.3, color: 'indigo' },

  // ── CHAAT SPECIALISTS (new category!) ────────────────────────────────────
  { id: '94', name: 'Panshikar\'s Chaat (Dadar) 🥗', active: true, craving: true, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0196, longitude: 72.8444, address: 'Dadar West, Mumbai', rating: 4.3, color: 'rose' },
  { id: '95', name: 'Teen Darwaza Chaat (Masjid) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9459, longitude: 72.8357, address: 'Masjid Bunder, Mumbai', rating: 4.2, color: 'orange' },
  { id: '96', name: 'Rajasthani Chaat Corner (Borivali) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.2295, longitude: 72.8573, address: 'Borivali East, Mumbai', rating: 4.0, color: 'yellow' },

  // ── MAHARASHTRIAN THALI (new!) ────────────────────────────────────────────
  { id: '97', name: 'Aaswad (Dadar) 🍱', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0184, longitude: 72.8441, address: 'Gokhale Road, Dadar West, Mumbai', rating: 4.5, color: 'green' },
  { id: '98', name: 'Mama Kane\'s (Matunga) 🍱', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0276, longitude: 72.8511, address: 'L. T. Road, Matunga West, Mumbai', rating: 4.4, color: 'emerald' },
  { id: '99', name: 'Parthasarathy Lunch Home (Sion) 🍱', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0393, longitude: 72.8636, address: 'Sion Circle, Sion, Mumbai', rating: 4.3, color: 'green' },
  { id: '100', name: 'Hotel Suruchi (Dadar) 🥘', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0199, longitude: 72.8458, address: 'Shivaji Park, Dadar, Mumbai', rating: 4.2, color: 'green' },

  // ── GOAN (new!) ───────────────────────────────────────────────────────────
  { id: '101', name: 'O Pedro (BKC) 🦞', active: true, craving: false, category: 'Goan', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0664, longitude: 72.8618, address: 'Jet Airways Bandra Kurla Complex, BKC, Mumbai', rating: 4.6, color: 'amber' },
  { id: '102', name: 'Martin\'s Corner (Kurla) 🐟', active: true, craving: false, category: 'Goan', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0728, longitude: 72.8826, address: 'CST Road, Kurla, Mumbai', rating: 4.3, color: 'sky' },

  // ── NORTH & CENTRAL MUMBAI (underrepresented!) ────────────────────────────
  { id: '103', name: 'Hotel Ram Nath (Sion) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0393, longitude: 72.8631, address: 'Sion Circle, Sion, Mumbai', rating: 4.3, color: 'emerald' },
  { id: '104', name: 'Shree Krishna Vasant Vihar (Thane border) 🥗', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.2183, longitude: 72.9781, address: 'Vasant Vihar, Thane West, Mumbai', rating: 4.2, color: 'green' },
  { id: '105', name: 'Hotel Pankaj (Mulund) 🍛', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.1726, longitude: 72.9523, address: 'M.G. Road, Mulund West, Mumbai', rating: 4.1, color: 'yellow' },
  { id: '106', name: 'Govinda\'s (Hare Krishna Mandir, Juhu) 🌿', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.1050, longitude: 72.8272, address: 'Hare Krishna Land, Juhu, Mumbai', rating: 4.3, color: 'green' },
  { id: '107', name: 'Hotel Ashoka (Goregaon) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.1605, longitude: 72.8497, address: 'S.V. Road, Goregaon West, Mumbai', rating: 4.1, color: 'emerald' },
  { id: '108', name: 'Celebration (Malad) 🍕', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.1863, longitude: 72.8490, address: 'Malad West, Mumbai', rating: 4.0, color: 'amber' },
  { id: '109', name: 'Banana Leaf (Kandivali) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.2054, longitude: 72.8492, address: 'Kandivali West, Mumbai', rating: 4.2, color: 'emerald' },

  // ── VERSOVA / OSHIWARA / JOGESHWARI ──────────────────────────────────────
  { id: '110', name: 'Versova Koliwada Fish Fry 🐠', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1327, longitude: 72.8168, address: 'Versova Koliwada, Andheri West, Mumbai', rating: 4.4, color: 'sky' },
  { id: '111', name: 'Cafe Madhuban (Oshiwara) ☕', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Cozy Cafe', priceRange: '₹₹', latitude: 19.1350, longitude: 72.8332, address: 'Oshiwara, Andheri West, Mumbai', rating: 4.1, color: 'stone' },
  { id: '112', name: 'Highway Gomantak (Bandra) 🦀', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0611, longitude: 72.8363, address: 'Hill Road, Bandra West, Mumbai', rating: 4.5, color: 'sky' },

  // ── PUBS & BARS (was ZERO!) ───────────────────────────────────────────────
  { id: '113', name: 'The Tavern (Colaba) 🍺', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Pub / Bar', priceRange: '₹₹', latitude: 18.9229, longitude: 72.8314, address: 'Colaba Causeway, Colaba, Mumbai', rating: 4.0, color: 'amber' },
  { id: '114', name: 'The Irish House (Lower Parel) 🍻', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Pub / Bar', priceRange: '₹₹₹', latitude: 18.9994, longitude: 72.8304, address: 'High Street Phoenix, Lower Parel, Mumbai', rating: 4.1, color: 'green' },
  { id: '115', name: 'Toit Taproom (BKC) 🍺', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Pub / Bar', priceRange: '₹₹₹', latitude: 19.0662, longitude: 72.8620, address: 'BKC, Bandra East, Mumbai', rating: 4.4, color: 'amber' },
  { id: '116', name: 'Woodside Inn (Andheri) 🍻', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Pub / Bar', priceRange: '₹₹', latitude: 19.1189, longitude: 72.8459, address: 'Versova Road, Andheri West, Mumbai', rating: 4.2, color: 'green' },
  { id: '117', name: 'The Finch (Bandra) 🍷', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Pub / Bar', priceRange: '₹₹₹', latitude: 19.0572, longitude: 72.8285, address: 'Chapel Road, Bandra West, Mumbai', rating: 4.3, color: 'indigo' },

  // ── BUDGET (₹) GAPS FILLED ────────────────────────────────────────────────
  { id: '118', name: 'Chacha\'s Keema Pav (Dharavi) 🥩', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0425, longitude: 72.8538, address: 'Dharavi Main Road, Mumbai', rating: 4.1, color: 'red' },
  { id: '119', name: 'Rajendra Dosa Camp (Andheri) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1183, longitude: 72.8472, address: 'Andheri Station East, Mumbai', rating: 4.2, color: 'emerald' },
  { id: '120', name: 'Jai Hind Lunch Home (Bandra) 🐟', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0559, longitude: 72.8378, address: 'SV Road, Bandra West, Mumbai', rating: 4.3, color: 'sky' },
  { id: '121', name: 'Sion Koliwada Seafood Stalls 🦐', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0414, longitude: 72.8642, address: 'Sion Koliwada, Sion, Mumbai', rating: 4.2, color: 'sky' },
  { id: '122', name: 'Bachelorr\'s (Colaba) 🥤', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9223, longitude: 72.8309, address: 'Colaba Causeway, Colaba, Mumbai', rating: 4.2, color: 'pink' },
  { id: '123', name: 'Shiv Sagar (Juhu) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.1054, longitude: 72.8267, address: 'Juhu Tara Road, Juhu, Mumbai', rating: 4.0, color: 'rose' },
  { id: '124', name: 'New Martin Hotel (Colaba) 🥚', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9238, longitude: 72.8318, address: 'Strand Road, Colaba, Mumbai', rating: 4.1, color: 'stone' },
  { id: '125', name: 'Moti Mahal (Grant Road) 🫕', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 18.9638, longitude: 72.8200, address: 'Grant Road West, Mumbai', rating: 4.0, color: 'yellow' },
  { id: '126', name: 'New Apsara (Bandra) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0542, longitude: 72.8376, address: 'Turner Road, Bandra West, Mumbai', rating: 4.0, color: 'rose' },
  { id: '127', name: 'Pav Bhaji @ Juhu Beach 🧈', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0966, longitude: 72.8261, address: 'Juhu Beach Stalls, Juhu, Mumbai', rating: 4.0, color: 'orange' },

  // ── FINE DINING GAPS (₹₹₹) ───────────────────────────────────────────────
  { id: '128', name: 'Nksha (Bandra) 🍃', active: true, craving: false, category: 'Maharashtrian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0562, longitude: 72.8278, address: 'Chapel Road, Bandra West, Mumbai', rating: 4.5, color: 'green' },
  { id: '129', name: 'Trèsind (BKC) 🎭', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0675, longitude: 72.8622, address: 'G-Block, BKC, Mumbai', rating: 4.7, color: 'indigo' },
  { id: '130', name: 'Ziya (Marine Drive) 🌟', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9435, longitude: 72.8230, address: 'The Oberoi Hotel, Marine Drive, Mumbai', rating: 4.7, color: 'amber' },
  { id: '131', name: 'Ai (Juhu) 🍜', active: true, craving: false, category: 'Japanese & Sushi', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.1062, longitude: 72.8261, address: 'Juhu Tara Road, Juhu, Mumbai', rating: 4.4, color: 'indigo' },
  { id: '132', name: 'Avartana (ITC Grand Central, Parel) 🍱', active: true, craving: false, category: 'South Indian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9991, longitude: 72.8326, address: 'ITC Grand Central, Parel, Mumbai', rating: 4.8, color: 'emerald' },
  { id: '133', name: 'Celini (Grand Hyatt, Santacruz) 🍝', active: true, craving: false, category: 'Pizza & Pasta', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.0870, longitude: 72.8648, address: 'Grand Hyatt, Santacruz East, Mumbai', rating: 4.5, color: 'amber' },
  { id: '134', name: 'Pa Pa Ya (Lower Parel) 🥡', active: true, craving: false, category: 'Indo-Chinese', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9998, longitude: 72.8296, address: 'High Street Phoenix, Lower Parel, Mumbai', rating: 4.4, color: 'indigo' },
  { id: '135', name: 'The Table (Colaba) 🍽️', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 18.9216, longitude: 72.8317, address: 'Kaala Ghoda, Colaba, Mumbai', rating: 4.6, color: 'stone' },

  // ── MISAL PAV SPECIALISTS (was completely missing!) ───────────────────────
  { id: '136', name: 'Aaswad Misal (Dadar) 🌶️', active: true, craving: true, category: 'Misal Pav', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0184, longitude: 72.8441, address: 'Gokhale Road, Dadar West, Mumbai', rating: 4.6, color: 'red' },
  { id: '137', name: 'Cafe Mysore Misal (Matunga) 🌶️', active: true, craving: false, category: 'Misal Pav', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0280, longitude: 72.8508, address: 'Matunga West, Mumbai', rating: 4.4, color: 'orange' },
  { id: '138', name: 'Shree Vijay (Thane - border) 🌶️', active: true, craving: false, category: 'Misal Pav', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.2160, longitude: 72.9781, address: 'Naupada, Thane West, Mumbai', rating: 4.5, color: 'red' },
  { id: '139', name: 'Mamledar Misal (Thane - border) 🌶️', active: true, craving: false, category: 'Misal Pav', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.1976, longitude: 72.9634, address: 'Mamledar Wadi, Thane West, Mumbai', rating: 4.7, color: 'red' },
  { id: '140', name: 'Kolhapuri Misal @ Dharavi 🌶️', active: true, craving: false, category: 'Misal Pav', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0440, longitude: 72.8531, address: 'Dharavi Main Road, Mumbai', rating: 4.2, color: 'orange' },
  { id: '141', name: 'Prakash Misal (Borivali) 🌶️', active: true, craving: false, category: 'Misal Pav', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.2309, longitude: 72.8567, address: 'Borivali West, Mumbai', rating: 4.3, color: 'red' },

  // ── FRANKIE & ROLLS (completely missing!) ─────────────────────────────────
  { id: '142', name: 'Tibbs Frankie (Churchgate) 🌯', active: true, craving: true, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9330, longitude: 72.8254, address: 'Veer Nariman Road, Churchgate, Mumbai', rating: 4.3, color: 'amber' },
  { id: '143', name: 'Frankie Corner (Bandra) 🌯', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0573, longitude: 72.8362, address: 'Hill Road, Bandra West, Mumbai', rating: 4.1, color: 'amber' },
  { id: '144', name: 'Rolls Mania (Andheri) 🌯', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.1196, longitude: 72.8465, address: 'Andheri West, Mumbai', rating: 4.0, color: 'orange' },

  // ── DABELI (completely missing!) ───────────────────────────────────────────
  { id: '145', name: 'Kutchi Dabeli @ Juhu 🥔', active: true, craving: true, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0962, longitude: 72.8260, address: 'Juhu Beach, Mumbai', rating: 4.2, color: 'rose' },
  { id: '146', name: 'Dabeli Stall @ Chowpatty 🥔', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9551, longitude: 72.8145, address: 'Girgaon Chowpatty, Mumbai', rating: 4.1, color: 'rose' },
  { id: '147', name: 'Original Kutchi Dabeli (Borivali) 🥔', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.2315, longitude: 72.8572, address: 'Borivali Station Road, Mumbai', rating: 4.3, color: 'amber' },

  // ── KHEEMA PAV & MUTTON SPECIALTIES ───────────────────────────────────────
  { id: '148', name: 'Olympia Coffee House (Colaba) 🥩', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9230, longitude: 72.8313, address: 'Rahim Mansion, Colaba Causeway, Mumbai', rating: 4.4, color: 'stone' },
  { id: '149', name: 'Sarvi Restaurant (Bhendi Bazar) 🥩', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Casual Dining', priceRange: '₹', latitude: 18.9520, longitude: 72.8362, address: 'Bhendi Bazar, Mumbai', rating: 4.5, color: 'red' },
  { id: '150', name: 'Cafe Rex (Colaba) 🥚', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9239, longitude: 72.8316, address: 'S.B. Singh Road, Colaba, Mumbai', rating: 4.2, color: 'stone' },
  { id: '151', name: 'Boran\'s Kheema Pav (Dharavi) 🥩', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0430, longitude: 72.8534, address: 'Dharavi, Mumbai', rating: 4.1, color: 'red' },
  { id: '152', name: 'Minara Masjid Mutton Stalls 🍖', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9511, longitude: 72.8361, address: 'Minara Masjid, Bhendi Bazar, Mumbai', rating: 4.4, color: 'orange' },

  // ── THALIPEETH & MAHARASHTRIAN STREET ─────────────────────────────────────
  { id: '153', name: 'Panshikar\'s Thalipeeth (Dadar) 🥞', active: true, craving: false, category: 'Maharashtrian', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0200, longitude: 72.8445, address: 'Dadar West, Mumbai', rating: 4.4, color: 'green' },
  { id: '154', name: 'Poha & Jalebi Corner (Matunga) 🍩', active: true, craving: false, category: 'Maharashtrian', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0274, longitude: 72.8510, address: 'Matunga West Station, Mumbai', rating: 4.2, color: 'yellow' },
  { id: '155', name: 'Anand Bhavan (Matunga) 🍱', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0278, longitude: 72.8503, address: 'Lady Jamshedji Road, Matunga West, Mumbai', rating: 4.4, color: 'green' },
  { id: '156', name: 'Shree Ganesh (Borivali) 🥘', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.2314, longitude: 72.8560, address: 'S.V. Road, Borivali West, Mumbai', rating: 4.1, color: 'green' },
  { id: '157', name: 'Puran Poli Ghar (Dadar) 🫓', active: true, craving: false, category: 'Maharashtrian', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0188, longitude: 72.8447, address: 'Shivaji Park, Dadar, Mumbai', rating: 4.3, color: 'amber' },

  // ── BOMBAY SANDWICH SPECIALISTS ────────────────────────────────────────────
  { id: '158', name: 'Sandwich House (Churchgate) 🥪', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9329, longitude: 72.8251, address: 'Near Churchgate Station, Mumbai', rating: 4.3, color: 'green' },
  { id: '159', name: 'Guru Kripa Sandwich (Sion) 🥪', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0398, longitude: 72.8634, address: 'Sion Circle, Sion, Mumbai', rating: 4.1, color: 'green' },
  { id: '160', name: 'Bombay Sandwich Co. (Bandra) 🥪', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0582, longitude: 72.8281, address: 'Pali Hill, Bandra West, Mumbai', rating: 4.3, color: 'green' },

  // ── CHINESE BHEL & DESI CHINESE ───────────────────────────────────────────
  { id: '161', name: 'Chinese Bhel Corner (Andheri) 🍜', active: true, craving: false, category: 'Indo-Chinese', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1185, longitude: 72.8460, address: 'Andheri West, Mumbai', rating: 4.0, color: 'indigo' },
  { id: '162', name: 'Chopsticks (Bandra) 🥢', active: true, craving: false, category: 'Indo-Chinese', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0578, longitude: 72.8273, address: 'Chapel Road, Bandra West, Mumbai', rating: 4.1, color: 'indigo' },
  { id: '163', name: 'Hakka Noodle Stall (Dharavi) 🍜', active: true, craving: false, category: 'Indo-Chinese', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0432, longitude: 72.8536, address: '90 Feet Road, Dharavi, Mumbai', rating: 4.0, color: 'red' },

  // ── GOLA / ICE GOLA / KULFI ────────────────────────────────────────────────
  { id: '164', name: 'Ice Gola Stalls @ Marine Drive 🧊', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9442, longitude: 72.8230, address: 'Marine Drive Promenade, Mumbai', rating: 4.1, color: 'sky' },
  { id: '165', name: 'Cream & Co. Kulfi (Juhu) 🍦', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1060, longitude: 72.8263, address: 'Juhu Tara Road, Mumbai', rating: 4.2, color: 'pink' },
  { id: '166', name: 'Naturals Ice Cream (Juhu) 🍨', active: true, craving: true, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1063, longitude: 72.8271, address: 'Juhu, Mumbai', rating: 4.6, color: 'pink' },
  { id: '167', name: 'Naturals Ice Cream (Bandra) 🍨', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0598, longitude: 72.8338, address: 'Hill Road, Bandra West, Mumbai', rating: 4.5, color: 'rose' },

  // ── SOUTH MUMBAI HIDDEN GEMS ───────────────────────────────────────────────
  { id: '168', name: 'Delhi Punjabi (CST Area) 🫕', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 18.9399, longitude: 72.8352, address: 'D.N. Road, Fort, Mumbai', rating: 4.1, color: 'yellow' },
  { id: '169', name: 'Shah Abdul (Nagpada) 🍖', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9573, longitude: 72.8349, address: 'Nagpada Junction, Mumbai', rating: 4.3, color: 'red' },
  { id: '170', name: 'Shalimar Restaurant (Mohammed Ali Rd) 🍗', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 18.9524, longitude: 72.8361, address: 'Mohammed Ali Road, Mumbai', rating: 4.4, color: 'orange' },
  { id: '171', name: 'Baghdadi (Colaba) 🥙', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9240, longitude: 72.8329, address: 'Tulloch Road, Colaba, Mumbai', rating: 4.3, color: 'stone' },
  { id: '172', name: 'Café Universal (Fort) ☕', active: true, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.9321, longitude: 72.8333, address: 'Prescott Road, Fort, Mumbai', rating: 4.2, color: 'stone' },

  // ── SUBURBAN LUNCH HOMES & DHABAS ─────────────────────────────────────────
  { id: '173', name: 'Hotel Rama Nayak (Matunga) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0272, longitude: 72.8520, address: 'Senapati Bapat Marg, Matunga East, Mumbai', rating: 4.4, color: 'emerald' },
  { id: '174', name: 'Sai Sagar (Vashi) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0771, longitude: 73.0071, address: 'Sector 17, Vashi, Navi Mumbai', rating: 4.0, color: 'rose' },
  { id: '175', name: 'Hotel Gajali (Belapur) 🍲', active: true, craving: false, category: 'Malvani & Seafood', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0218, longitude: 73.0380, address: 'CBD Belapur, Navi Mumbai', rating: 4.2, color: 'sky' },
  { id: '176', name: 'Kinara (Juhu) 🌴', active: true, craving: false, category: 'Maharashtrian', ambience: 'Fine Dining', priceRange: '₹₹₹', latitude: 19.1048, longitude: 72.8261, address: 'Juhu Tara Road, Juhu, Mumbai', rating: 4.3, color: 'green' },
  { id: '177', name: 'Dakshinayan (Powai) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.1173, longitude: 72.9059, address: 'Hiranandani, Powai, Mumbai', rating: 4.3, color: 'emerald' },

  // ── PANI PURI & CHAAT CORNERS ──────────────────────────────────────────────
  { id: '178', name: 'Bhavnagri Ganthia (Kalbadevi) 🥜', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 18.9507, longitude: 72.8288, address: 'Kalbadevi Road, Mumbai', rating: 4.2, color: 'yellow' },
  { id: '179', name: 'Shri Ram Pani Puri (Andheri) 🥤', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1198, longitude: 72.8463, address: 'S.V. Road, Andheri West, Mumbai', rating: 4.1, color: 'rose' },
  { id: '180', name: 'Bhajiya Pav Corner (Dadar) 🥦', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0200, longitude: 72.8451, address: 'Dadar Station East, Mumbai', rating: 4.0, color: 'green' },
  { id: '181', name: 'Sev Puri & Ragda Stall (Malad) 🥗', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.1870, longitude: 72.8489, address: 'Malad West, Mumbai', rating: 4.0, color: 'orange' },

  // ── UNIQUE MUMBAI EXPERIENCES ──────────────────────────────────────────────
  { id: '182', name: 'Bade Miyan (Colaba) 🍢', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹₹', latitude: 18.9243, longitude: 72.8331, address: 'Tullock Road, Colaba, Mumbai', rating: 4.0, color: 'orange' },
  { id: '183', name: 'Nandu\'s Butter Chicken (Santacruz) 🍗', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0831, longitude: 72.8398, address: 'Santacruz West, Mumbai', rating: 4.3, color: 'orange' },
  { id: '184', name: 'Cafe Mysore (Matunga) 🍛', active: true, craving: false, category: 'South Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0277, longitude: 72.8506, address: 'Matunga West, Mumbai', rating: 4.5, color: 'emerald' },
  { id: '185', name: 'Sion Koliwada Kombdi Vade 🐔', active: true, craving: false, category: 'Maharashtrian', ambience: 'Casual Dining', priceRange: '₹₹', latitude: 19.0416, longitude: 72.8641, address: 'Sion Koliwada, Mumbai', rating: 4.5, color: 'green' },
  { id: '186', name: 'Bandra Kebab Corner (Bandra) 🍢', active: true, craving: false, category: 'Mughlai & Kebabs', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0570, longitude: 72.8406, address: 'Waterfield Road, Bandra West, Mumbai', rating: 4.1, color: 'red' },
  { id: '187', name: 'Kohinoor Mithaiwala (Dadar) 🍮', active: true, craving: false, category: 'Cafes & Desserts', ambience: 'Street Food Stall', priceRange: '₹', latitude: 19.0190, longitude: 72.8443, address: 'Dadar TT, Dadar West, Mumbai', rating: 4.3, color: 'pink' },
  { id: '188', name: 'Jumbo King Vada Pav (Multiple) 🥔', active: true, craving: false, category: 'Mumbai Street Food', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.0760, longitude: 72.8777, address: 'Kurla Station, Mumbai', rating: 3.9, color: 'orange' },
  { id: '189', name: 'Cafe Good Luck (Pune - for comparison) ☕', active: false, craving: false, category: 'Irani Cafe', ambience: 'Irani Cafe Vibe', priceRange: '₹', latitude: 18.5204, longitude: 73.8567, address: 'Deccan Gymkhana, Pune (day trip!)', rating: 4.5, color: 'stone' },
  { id: '190', name: 'Sindhi Curry House (Ulhasnagar) 🫕', active: true, craving: false, category: 'Punjabi & North Indian', ambience: 'Casual Dining', priceRange: '₹', latitude: 19.2183, longitude: 73.1556, address: 'Ulhasnagar, Mumbai Region', rating: 4.2, color: 'yellow' }
];

// Presets mapping for new manual addition helper
const PRESET_CUISINES = [
  { emoji: '🍛', label: 'South Indian', category: 'South Indian', color: 'emerald' },
  { emoji: '🥦', label: 'Punjabi & North Indian', category: 'Punjabi & North Indian', color: 'yellow' },
  { emoji: '🍜', label: 'Indo-Chinese (Spicy)', category: 'Indo-Chinese', color: 'indigo' },
  { emoji: '🥤', label: 'Mumbai Street Food', category: 'Mumbai Street Food', color: 'rose' },
  { emoji: '🍢', label: 'Mughlai & Kebabs', category: 'Mughlai & Kebabs', color: 'orange' },
  { emoji: '🍲', label: 'Malvani & Seafood', category: 'Malvani & Seafood', color: 'sky' },
  { emoji: '🍚', label: 'Spicy Dum Biryani', category: 'Biryani', color: 'red' },
  { emoji: '☕', label: 'Irani Cafe Specialties', category: 'Irani Cafe', color: 'stone' },
  { emoji: '🍕', label: 'Pizza & Pasta Feast', category: 'Pizza & Pasta', color: 'amber' },
  { emoji: '🍱', label: 'Maharashtrian Thali', category: 'Maharashtrian', color: 'green' },
  { emoji: '🌶️', label: 'Misal Pav', category: 'Misal Pav', color: 'red' },
  { emoji: '🦞', label: 'Goan Specialties', category: 'Goan', color: 'sky' },
  { emoji: '🍣', label: 'Japanese & Sushi', category: 'Japanese & Sushi', color: 'indigo' },
  { emoji: '🌯', label: 'Frankie & Rolls', category: 'Mumbai Street Food', color: 'amber' }
];

// Food inspirations
const FOOD_INSPIRATIONS = [
  "Hot Mysore Masala Dosa 🍛 from Ram Ashray",
  "Tender Seekh Kebab 🍢 from Colaba Bademiya",
  "Butter Pav Bhaji 🧈 from Sardar Tardeo",
  "Famous Red Brownies 🧁 from Theobroma Bandra",
  "Berry Pulav & Soda 🍛 from Britannia Cafe",
  "Spicy Paneer Chili 🍜 from Yauatcha",
  "Schezwan Triple Rice 🍜",
  "Chilled Pani Puri 🥤 from Elco Hill Road",
  "Butter Garlic Crab 🍲 from Gajalee East",
  "Mango Icecream Sandwich 🍦 from K Rustom",
  "Cutting Chai & Bun Maska ☕ from Kyani Marine Lines",
  "Sizzling Seekh Kebabs 🍢 from Mohammed Ali Road",
  "Juicy Corn Bhutta 🌽 at Juhu Beach",
  "Falooda & Mango Shake 🥭 at Haji Ali Juice Centre",
  "Crispy Bhel Puri 🥗 at Chowpatty Beach",
  "Piping Hot Vada Pav 🥔 from Vithal's Dadar",
  "Caramel Latte ☕ at Blue Tokai Bandra",
  "Soulful Butter Garlic Tiger Prawns 🦐 from Trishna Fort",
  "Creamy Kulfi 🍦 from New Kulfi Centre Chowpatty",
  "Nalli Nihari & Sheermal 🍖 from Shalimar Bhendi Bazar",
  "Gujarati Thali 🍱 from Shree Thaker Bhojanalay",
  "Galinha Cafreal 🍛 from Britannia & Co. Fort",
  "Signature Crêpe 🥙 at Suzette Bandra",
  "Dal Baati Churma 🫕 at Rajdhani Lower Parel",
  "Burmese Khow Suey 🍜 from Burma Burma Fort",
  "Cold Coffee Affogato ☕ at Kala Ghoda Cafe",
  "Masala Dosa & Filter Coffee 🍛 from Arya Bhavan Matunga",
  "Crab Xacuti 🦀 from Suresh Lunch Home Chembur",
  "Molecular Chaat 🔬 at Masala Library BKC",
  "Mezze Platter 🫒 at Bayroute Juhu",
  "Mutton Biryani 🍚 from Noor Mohammadi Bhendi Bazar",
  "Brun Maska & Chai ☕ at Sassanian Dhobi Talao",
  "Chicken Xacuti 🦞 at O Pedro BKC",
  "Sol Kadhi & Fresh Fish 🐠 at Versova Koliwada",
  "Akuri on Toast 🥚 at Ideal Corner Fort",
  "Surmai Fry 🐟 from Highway Gomantak Bandra",
  "Tasting Menu 🌟 at Avartana ITC Parel",
  "Maharashtrian Thali 🍱 at Aaswad Dadar",
  "Craft Beer Flight 🍺 at Toit BKC",
  "Bheja Fry & Pav 🥩 from Chacha's Dharavi",
  "Koliwada Fish Fry 🐠 at Versova Beach",
  "Spicy Misal Pav 🌶️ at Aaswad Dadar",
  "Tarri Misal 🌶️ at Mamledar Thane",
  "Chicken Seekh Frankie 🌯 from Tibbs Churchgate",
  "Kutchi Dabeli 🥔 on Juhu Beach",
  "Sizzling Kheema Pav 🥩 at Olympia Colaba",
  "Thalipeeth with White Butter 🥞 at Panshikar's Dadar",
  "Puran Poli & Katachi Amti 🫓 at Shivaji Park",
  "Bhajiya Pav in the rain 🥦 at Dadar Station",
  "Chilled Mango Kulfi 🍦 from Naturals Juhu",
  "Mutton Sukka 🍖 from Sarvi Bhendi Bazar",
  "Akuri & Brun at Baghdadi Colaba 🥚",
  "Ice Gola at Marine Drive Promenade 🧊",
  "Kombdi Vade 🐔 at Sion Koliwada",
  "Bombay Masala Sandwich 🥪 near Churchgate Station"
];

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  shape: 'circle' | 'square' | 'triangle' | 'emoji';
  emojiText?: string;
  delay: number;
}

const EMOJIS = ['🍕', '🍢', '🍔', '🥤', '🍜', '🥞', '🍩', '🍲', '☕', '✨', '🎉'];
const CONFIG_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    try {
      const saved = localStorage.getItem('what_should_we_eat_restaurants_v2');
      if (saved) {
        const parsed = JSON.parse(saved) as Restaurant[];
        // Enforce the default accurate location spots if empty or small
        if (parsed.length < 150) return DEFAULT_RESTAURANTS;
        return parsed;
      }
      return DEFAULT_RESTAURANTS;
    } catch {
      return DEFAULT_RESTAURANTS;
    }
  });

  const [history, setHistory] = useState<ChoiceHistory[]>(() => {
    try {
      const saved = localStorage.getItem('what_should_we_eat_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wizard active criteria
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null); // Step 1: Vibe
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null); // Step 2: Price
  const [selectedFoodCategories, setSelectedFoodCategories] = useState<string[]>([]); // Step 3: Food Types (optional)

  // Spot detail clicked on Map state
  const [selectedOnMap, setSelectedOnMap] = useState<Restaurant | null>(null);

  // Manual Add Form states
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newRestaurantCategory, setNewRestaurantCategory] = useState('South Indian');
  const [newRestaurantAmbience, setNewRestaurantAmbience] = useState('Casual Dining');
  const [newRestaurantPrice, setNewRestaurantPrice] = useState<'₹' | '₹₹' | '₹₹₹'>('₹₹');
  const [newRestaurantAddress, setNewRestaurantAddress] = useState('');
  
  // Search state for managing candidates
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');
  const [favoriteOnlyFilter, setFavoriteOnlyFilter] = useState(false);
  const [prioritizeFavorites, setPrioritizeFavorites] = useState(true);

  // New Dual-stage Progressive Spinner states
  const [spinnerStage, setSpinnerStage] = useState<'idle' | 'spinning_cuisine' | 'spinning_restaurant' | 'completed'>('idle');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cuisineWinner, setCuisineWinner] = useState<string | null>(null);
  const [cuisineReelSequence, setCuisineReelSequence] = useState<string[]>([]);
  const [restaurantReelSequence, setRestaurantReelSequence] = useState<Restaurant[]>([]);
  const [spinCount, setSpinCount] = useState(0);
  const [restaurantSpinCount, setRestaurantSpinCount] = useState(0);

  // Visual custom confetti
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  // Editing Spot inline Text
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Auto Scroll Tracker
  const bottomRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('what_should_we_eat_restaurants_v2', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('what_should_we_eat_history_v2', JSON.stringify(history));
  }, [history]);

  // Sync maps panning when a winner is chosen
  useEffect(() => {
    if (winner) {
      setSelectedOnMap(winner);
      // Auto-scroll to winner celebrations card
      const element = document.getElementById("chooser-card");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [winner]);

  // Extract all categories in database
  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    restaurants.forEach(r => {
      if (r.category) list.add(r.category);
    });
    return ['All', ...Array.from(list)];
  }, [restaurants]);

  // Filter spots based on standard search
  const filteredConfigRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (r.ambience && r.ambience.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategoryTab = activeCategoryTab === 'All' || r.category === activeCategoryTab;
      return matchesSearch && matchesCategoryTab;
    });
  }, [restaurants, searchQuery, activeCategoryTab]);

  // calculate real-time ACTIVE DECISION POOL filtered in 3 sequential steps
  const itemsWithOdds = useMemo(() => {
    const activeItems = restaurants.filter(r => {
      // Must be globally enabled
      if (!r.active) return false;

      // Rule 1: Match Ambience Vibe (Step 1)
      const matchesVibe = !selectedVibe || r.ambience === selectedVibe;

      // Rule 2: Match Price Range (Step 2)
      const matchesPrice = !selectedPrice || r.priceRange === selectedPrice;

      // Rule 3: Choose what food to eat (Step 3 - Completely Optional!)
      // If any specific categories are chosen, keep only those. If not, spin "All matching vibes/prices".
      const matchesFood = selectedFoodCategories.length === 0 || 
                          (r.category && selectedFoodCategories.includes(r.category));

      // Extra toggle filters
      const matchesFavorite = !favoriteOnlyFilter || r.favorite;

      return matchesVibe && matchesPrice && matchesFood && matchesFavorite;
    });

    if (activeItems.length === 0) return [];

    let totalWeight = 0;
    const itemsWeights = activeItems.map(r => {
      let multiplier = 1;
      if (r.craving) multiplier *= 3;
      if (prioritizeFavorites && r.favorite) multiplier *= 5; // Favorites get 5x odds boost
      const weight = multiplier;
      totalWeight += weight;
      return { ...r, weight };
    });

    return itemsWeights.map(item => ({
      ...item,
      odds: totalWeight > 0 ? (item.weight / totalWeight) * 100 : 0
    }));
  }, [restaurants, selectedVibe, selectedPrice, selectedFoodCategories, favoriteOnlyFilter, prioritizeFavorites]);

  // Click Sound FX generator using browser's Audio Synthesizer
  const playClickSound = (frequency = 800) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Safe boundary fallback
    }
  };

  const playWinnerSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.07, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const t = ctx.currentTime;
      playBeep(523.25, t, 0.15); // C5
      playBeep(659.25, t + 0.12, 0.15); // E5
      playBeep(783.99, t + 0.24, 0.15); // G5
      playBeep(1046.50, t + 0.36, 0.45); // C6
    } catch {
      // Safe boundary fallback
    }
  };

  // Convert real latitude / longitude to animated coordinates on simulated local vector map
  const getSimulatedCoords = (lat: number, lng: number) => {
    // scale lat (19.13 top north Mumbai, 18.91 bottom colaba) to Y (20px to 310px)
    const y = 320 - ((lat - 18.91) / (19.13 - 18.91)) * (320 - 20);
    // scale lng (72.81 west coast, 72.87 east) to X (20px to 270px)
    const x = ((lng - 72.81) / (72.87 - 72.81)) * (260 - 20);
    return { x, y };
  };

  // Preset button handle
  const handleAddPreset = (p: typeof PRESET_CUISINES[number]) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const labelClean = p.label;
    const nameWithFormat = `${p.emoji} ${labelClean} Spot`;
    
    // Check if duplicate
    if (restaurants.some(r => r.name.toLowerCase() === nameWithFormat.toLowerCase())) return;

    // generate a randomized coordinate within central Mumbai (Bandra-Matunga bounds)
    const randomizedLat = 19.00 + Math.random() * 0.08;
    const randomizedLng = 72.83 + Math.random() * 0.03;

    const newSpot: Restaurant = {
      id,
      name: nameWithFormat,
      active: true,
      craving: false,
      category: p.category,
      ambience: 'Casual Dining',
      priceRange: '₹₹',
      latitude: parseFloat(randomizedLat.toFixed(5)),
      longitude: parseFloat(randomizedLng.toFixed(5)),
      address: 'Central Mumbai, Maharashtra',
      rating: 4.3,
      color: p.color
    };

    setRestaurants(prev => [...prev, newSpot]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGetInspiration = () => {
    const rIdx = Math.floor(Math.random() * FOOD_INSPIRATIONS.length);
    setNewRestaurantName(FOOD_INSPIRATIONS[rIdx]);
  };

  const handleAddCustomRestaurant = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nameTrimmed = newRestaurantName.trim();
    if (!nameTrimmed) return;

    const colors = ['orange', 'rose', 'amber', 'emerald', 'indigo', 'green', 'sky', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // generate a coordinate within central Mumbai
    const randomizedLat = 19.00 + Math.random() * 0.08;
    const randomizedLng = 72.83 + Math.random() * 0.03;

    const id = Date.now().toString();
    const newSpot: Restaurant = {
      id,
      name: nameTrimmed,
      active: true,
      craving: false,
      category: newRestaurantCategory || 'Custom',
      ambience: newRestaurantAmbience,
      priceRange: newRestaurantPrice,
      latitude: parseFloat(randomizedLat.toFixed(4)),
      longitude: parseFloat(randomizedLng.toFixed(4)),
      address: newRestaurantAddress.trim() || 'Central Suburbs, Mumbai',
      rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
      color: randomColor
    };

    setRestaurants(prev => [...prev, newSpot]);
    setNewRestaurantName('');
    setNewRestaurantAddress('');
    
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Toggle checks
  const handleToggleActive = (id: string) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleToggleCraving = (id: string) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, craving: !r.craving } : r));
  };

  const handleToggleFavorite = (id: string) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
  };

  const handleDeleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
    if (winner && winner.id === id) setWinner(null);
  };

  const handleStartEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditingText(restaurant.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, name: editingText.trim() } : r));
    setEditingId(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all current restaurant options?')) {
      setRestaurants([]);
      setWinner(null);
    }
  };

  const handleResetToPresets = () => {
    if (window.confirm('Reset food spots list back to Mumbai legendary default options?')) {
      setRestaurants(DEFAULT_RESTAURANTS);
      setWinner(null);
    }
  };

  // Confetti Particle System
  const triggerConfetti = () => {
    const list: ConfettiParticle[] = Array.from({ length: 45 }).map((_, i) => {
      const isEmoji = Math.random() > 0.4;
      return {
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: Math.random() * 15 + 10,
        color: CONFIG_COLORS[Math.floor(Math.random() * CONFIG_COLORS.length)],
        rotation: Math.random() * 360,
        shape: isEmoji ? 'emoji' : (Math.random() > 0.5 ? 'circle' : 'square'),
        emojiText: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
        delay: Math.random() * 0.4
      };
    });
    setConfetti(list);
  };

  // Spring Deceleration Sequential Two-Stage Slot Spinner Engine
  const startDecisionSpin = () => {
    const activeCandidates = itemsWithOdds;
    if (activeCandidates.length < 2) return;

    // Reset old states
    setWinner(null);
    setCuisineWinner(null);
    setConfetti([]);
    setSpinnerStage('spinning_cuisine');
    setIsSpinning(true);
    
    const nextSpinCount = spinCount + 1;
    setSpinCount(nextSpinCount);

    // 1. Determine Winning Category based on proportional restaurant weights
    const categoryWeights: { [key: string]: number } = {};
    activeCandidates.forEach(item => {
      const cat = item.category || 'Munch Spot';
      categoryWeights[cat] = (categoryWeights[cat] || 0) + (item.weight || 1);
    });

    const categoriesListToSpin = Object.keys(categoryWeights);
    const totalCatWeight = Object.values(categoryWeights).reduce((a, b) => a + b, 0);
    
    let chosenCategoryWinner = categoriesListToSpin[0];
    let randomCatWeight = Math.random() * totalCatWeight;
    for (const cat of categoriesListToSpin) {
      randomCatWeight -= categoryWeights[cat];
      if (randomCatWeight <= 0) {
        chosenCategoryWinner = cat;
        break;
      }
    }

    // 2. Determine Winning Restaurant inside that chosen Category
    const candidateRestaurants = activeCandidates.filter(r => (r.category || 'Munch Spot') === chosenCategoryWinner);
    const totalResWeight = candidateRestaurants.reduce((acc, curr) => acc + (curr.weight || 1), 0);
    
    let chosenRestaurantWinner = candidateRestaurants[0];
    let randomResWeight = Math.random() * totalResWeight;
    for (const item of candidateRestaurants) {
      randomResWeight -= (item.weight || 1);
      if (randomResWeight <= 0) {
        chosenRestaurantWinner = item;
        break;
      }
    }

    // 3. Build Cuisine Category Reel (A)
    const cuisineSequencePool: string[] = [];
    const allCategoriesPool = availableCuisinesForStep3;
    while (cuisineSequencePool.length < 32) {
      const shuffledList = [...allCategoriesPool].sort(() => Math.random() - 0.5);
      cuisineSequencePool.push(...shuffledList);
    }
    const finalCuisineSequence = cuisineSequencePool.slice(0, 32);
    finalCuisineSequence.push(chosenCategoryWinner); // Target winner category precisely
    finalCuisineSequence.push(allCategoriesPool[Math.floor(Math.random() * allCategoriesPool.length)]); // buffer item
    setCuisineReelSequence(finalCuisineSequence);

    // 4. Build Restaurant Spot Reel (B)
    const restaurantSequencePool: Restaurant[] = [];
    while (restaurantSequencePool.length < 32) {
      const shuffledList = [...activeCandidates].sort(() => Math.random() - 0.5);
      restaurantSequencePool.push(...shuffledList);
    }
    const finalRestaurantSequence = restaurantSequencePool.slice(0, 32);
    finalRestaurantSequence.push(chosenRestaurantWinner); // Target winner spot precisely
    finalRestaurantSequence.push(activeCandidates[Math.floor(Math.random() * activeCandidates.length)]); // buffer item
    setRestaurantReelSequence(finalRestaurantSequence);

    // 5. Run Audio and Timer for Step 1 Reel
    if (soundEnabled) {
      let tickNum = 0;
      const maxTicks = 12;
      const triggerCuisineTick = () => {
        if (tickNum < maxTicks) {
          playClickSound(800 - tickNum * 30);
          tickNum++;
          const delay = Math.pow(tickNum, 1.85) * 12 + 60;
          setTimeout(triggerCuisineTick, delay);
        }
      };
      triggerCuisineTick();
    }

    // Step 1 Duration: 2100ms
    setTimeout(() => {
      // Land Cuisine category!
      setCuisineWinner(chosenCategoryWinner);
      setSpinnerStage('spinning_restaurant');
      setRestaurantSpinCount(prev => prev + 1);
      
      // Play high-fidelity transitional notifier double beep
      if (soundEnabled) {
        playClickSound(950);
        setTimeout(() => playClickSound(1050), 100);

        // Run tick for Step 2 Reel (Restaurant Spot)
        let tickNum2 = 0;
        const maxTicks2 = 15;
        const triggerResTick = () => {
          if (tickNum2 < maxTicks2) {
            playClickSound(750 - tickNum2 * 25);
            tickNum2++;
            const delay2 = Math.pow(tickNum2, 1.9) * 14 + 65;
            setTimeout(triggerResTick, delay2);
          } else {
            setTimeout(playWinnerSound, 300);
          }
        };
        setTimeout(triggerResTick, 150);
      }

      // Step 2 Duration: 2300ms (Total elapsed: 4400ms)
      setTimeout(() => {
        setWinner(chosenRestaurantWinner);
        setSpinnerStage('completed');
        setIsSpinning(false);
        triggerConfetti();

        // Log decision history
        const logItem: ChoiceHistory = {
          id: Date.now().toString(),
          restaurantName: chosenRestaurantWinner.name,
          timestamp: Date.now(),
          vetoed: false
        };
        setHistory(prev => [logItem, ...prev].slice(0, 30));
      }, 2300);

    }, 2100);
  };

  // Re-spin Veto Option
  const handleVetoCurrentWinner = () => {
    if (!winner) return;

    // Veto current item in log history
    setHistory(prev => prev.map((item, index) => {
      if (index === 0 && item.restaurantName === winner.name) {
        return { ...item, vetoed: true };
      }
      return item;
    }));

    // Disable this option temporarily
    setRestaurants(prev => prev.map(r => r.id === winner.id ? { ...r, active: false } : r));

    const updatedCandidates = itemsWithOdds.filter(r => r.id !== winner.id);
    setWinner(null);
    setCuisineWinner(null);
    setSpinnerStage('idle');

    if (updatedCandidates.length >= 2) {
      setTimeout(() => {
        startDecisionSpin();
      }, 300);
    } else {
      alert(`"${winner.name}" was vetoed & disabled! Please add more matching items to roll again.`);
    }
  };

  const handleCopyOutcome = () => {
    if (!winner) return;
    const textToCopy = `🎯 Culinary Destiny Chosen!\nWe are heading to: **${winner.name}**\n📍 Address: ${winner.address || "Mumbai"}\nDecided by Dinner Dash! 🍽️`;
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all decision history logs?')) {
      setHistory([]);
    }
  };

  // Helper arrays for Step 3 cuisines
  const availableCuisinesForStep3 = [
    'South Indian',
    'Punjabi & North Indian',
    'Indo-Chinese',
    'Mumbai Street Food',
    'Mughlai & Kebabs',
    'Malvani & Seafood',
    'Biryani',
    'Irani Cafe',
    'Pizza & Pasta',
    'Cafes & Desserts'
  ];

  const activeSpotsCount = restaurants.filter(r => r.active).length;

  return (
    <div className="min-h-screen bg-[#FFF7ED] text-stone-850 selection:bg-amber-100 selection:text-amber-900 pb-12 transition-colors duration-300 relative">
      
      {/* VINTAGE MENU GRID CANVAS (Concept 2) */}
      <div className="fixed inset-0 pointer-events-none sketchy-doodle-grid select-none z-0" />
      
      {/* Vintage Wooden & Chalkboard Menu Boards in Wide Margins */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 hidden xl:block">
        
        {/* Left Side: Legacy Coffee House Classic Blackboard */}
        <div className="absolute left-[1.5vw] top-[12vh] w-52 p-4 rounded-3xl bg-[#FAF6F0] border-4 border-double border-[#1F2937] outline outline-1 outline-[#1F2937] outline-offset-4 shadow-[8px_8px_0_rgba(31,41,55,0.85)] rotate-[-2deg] animate-float-slow-1 opacity-95 transition-all duration-500 hover:rotate-2 hover:scale-102">
          {/* Top Brass Ring Mockup */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-300 border border-stone-800" />
            <div className="w-3 h-3 rounded-full bg-orange-300 border border-stone-800" />
          </div>
          
          <div className="text-center border-b-2 border-dashed border-[#1F2937] pb-2 mb-3 mt-1">
            <span className="text-[9px] font-mono font-black tracking-widest text-amber-700 uppercase">★ ESTD. 1923 ★</span>
            <h3 className="font-display font-black text-xs text-[#1F2937] uppercase tracking-wider mt-0.5">IRANI CLASSICS</h3>
            <div className="text-[10px] text-stone-500 font-serif leading-none mt-1">✦ ✦ ✦ ✦ ✦</div>
          </div>

          <div className="space-y-2.5 font-mono text-[10px] text-[#1F2937] font-bold">
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Bun Maska</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-amber-900">₹22</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Cutting Chai</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-amber-900">₹12</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Keema Pav</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-amber-900">₹80</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Mutton Puffs</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-amber-900">₹45</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Akuri on Toast</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-amber-900">₹65</span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#1F2937] text-center">
            <span className="inline-block bg-orange-100 border border-orange-300 text-orange-850 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">
              SAFFRON INFUSED
            </span>
          </div>
        </div>

        <div className="absolute left-[2vw] top-[58vh] w-52 p-4 rounded-3xl bg-[#FEF3C7] border-4 border-double border-[#1F2937] outline outline-1 outline-[#1F2937] outline-offset-4 shadow-[8px_8px_0_rgba(31,41,55,0.85)] rotate-[3deg] animate-float-slow-2 opacity-95 transition-all duration-300 hover:scale-105">
          <div className="text-center mb-2.5 border-b border-[#1F2937] pb-1.5">
            <span className="text-[8px] font-mono font-black tracking-widest text-[#1F2937] uppercase">✦ SOUTH SIDE CODES ✦</span>
            <h3 className="font-display font-black text-xs text-[#1F2937] uppercase tracking-tight mt-0.5">RAM ASHRAY SPECS</h3>
          </div>
          
          <div className="space-y-2 font-mono text-[9px] text-stone-800 font-black">
            <div className="flex justify-between items-baseline gap-0.5">
              <span>Mysore Masala</span>
              <span className="border-b border-dotted border-[#1F2937]/30 flex-grow min-w-2" />
              <span>₹90</span>
            </div>
            <div className="flex justify-between items-baseline gap-0.5">
              <span>Podi Idli (Ghee)</span>
              <span className="border-b border-dotted border-[#1F2937]/30 flex-grow min-w-2" />
              <span>₹75</span>
            </div>
            <div className="flex justify-between items-baseline gap-0.5">
              <span>Rava Sada Dosa</span>
              <span className="border-b border-dotted border-[#1F2937]/30 flex-grow min-w-2" />
              <span>₹80</span>
            </div>
          </div>

          <div className="mt-3.5 text-center flex justify-center">
            <div className="border border-dashed border-[#1F2937] px-2 py-0.5 text-[8px] font-mono text-[#1F2937]">
              HOT FILTER COFFEE
            </div>
          </div>
        </div>

        {/* Right Side: Legendary Street Snacks & Ice Cream Card */}
        <div className="absolute right-[1.5vw] top-[11vh] w-52 p-4 rounded-3xl bg-[#FAF6F0] border-4 border-double border-[#1F2937] outline outline-1 outline-[#1F2937] outline-offset-4 shadow-[8px_8px_0_rgba(31,41,55,0.85)] rotate-[2deg] animate-float-slow-2 opacity-95 transition-all duration-500 hover:rotate-[-2deg] hover:scale-102">
          {/* Top Hanging Ring Mockup */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-300 border border-stone-800" />
            <div className="w-3 h-3 rounded-full bg-orange-300 border border-stone-800" />
          </div>

          <div className="text-center border-b-2 border-dashed border-[#1F2937] pb-2 mb-3 mt-1">
            <span className="text-[9px] font-mono font-black tracking-widest text-emerald-700 uppercase">★ MUMBAIS GOLD ★</span>
            <h3 className="font-display font-black text-xs text-[#1F2937] uppercase tracking-wider mt-0.5">STREET DELIGHTS</h3>
            <div className="text-[10px] text-stone-500 font-serif leading-none mt-1">✦ ✦ ✦ ✦ ✦</div>
          </div>

          <div className="space-y-2.5 font-mono text-[10px] text-[#1F2937] font-bold">
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Vada Pav</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-emerald-800">₹18</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Pani Puri</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-emerald-800">₹55</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Pav Bhaji</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-emerald-800">₹110</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Chaat (Elco)</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-emerald-800">₹85</span>
            </div>
            <div className="flex justify-between items-baseline gap-1">
              <span className="truncate">Frankie (Tibbs)</span>
              <span className="border-b border-dotted border-stone-400 flex-grow min-w-4" />
              <span className="text-emerald-800">₹60</span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#1F2937] text-center">
            <span className="inline-block bg-emerald-100 border border-emerald-300 text-emerald-850 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">
              100% SECURE ODOS
            </span>
          </div>
        </div>

        <div className="absolute right-[2vw] top-[57vh] w-52 p-4 rounded-3xl bg-[#FBCFE8] border-4 border-double border-[#1F2937] outline outline-1 outline-[#1F2937] outline-offset-4 shadow-[8px_8px_0_rgba(31,41,55,0.85)] rotate-[-3deg] animate-float-slow-3 opacity-95 transition-all duration-300 hover:scale-105">
          <div className="text-center mb-2.5 border-b border-[#1F2937] pb-1.5">
            <span className="text-[8px] font-mono font-black tracking-widest text-[#1F2937] uppercase">✦ LEGENDARY SLABS ✦</span>
            <h3 className="font-display font-black text-xs text-[#1F2937] uppercase tracking-tight mt-0.5">K. RUSTOM SALOON</h3>
          </div>
          
          <div className="space-y-2 font-mono text-[9px] text-stone-800 font-black">
            <div className="flex justify-between items-baseline gap-0.5">
              <span>Mango Sandwich</span>
              <span className="border-b border-dotted border-[#1F2937]/30 flex-grow min-w-2" />
              <span>₹40</span>
            </div>
            <div className="flex justify-between items-baseline gap-0.5">
              <span>Rum & Raisin Biscuit</span>
              <span className="border-b border-dotted border-[#1F2937]/30 flex-grow min-w-2" />
              <span>₹45</span>
            </div>
            <div className="flex justify-between items-baseline gap-0.5">
              <span>Raspberry Kulfi</span>
              <span className="border-b border-dotted border-[#1F2937]/30 flex-grow min-w-2" />
              <span>₹35</span>
            </div>
          </div>

          <div className="mt-3.5 text-center flex justify-center">
            <div className="border border-dashed border-[#1F2937] px-2 py-0.5 text-[8px] font-mono text-[#1F2937]">
              CHILLED BLOCK SLABS
            </div>
          </div>
        </div>

      </div>

      {/* Decorative top strip */}
      <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-orange-500 to-rose-400 relative z-30" />

      {/* Custom Confetti Emitter Overlay */}
      {winner && confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confetti.map(p => (
            <motion.div
              key={p.id}
              initial={{ 
                x: `${p.x}vw`, 
                y: `${p.y}vh`, 
                rotate: p.rotation,
                scale: 0.1,
                opacity: 1 
              }}
              animate={{ 
                y: '110vh',
                rotate: p.rotation + 360 * (Math.random() > 0.5 ? 2 : -2),
                scale: 1,
                opacity: [1, 1, 0.8, 0]
              }}
              transition={{ 
                duration: Math.random() * 2.5 + 2.5, 
                ease: "easeOut",
                delay: p.delay
              }}
              className="absolute pointer-events-none"
              style={{
                fontSize: p.shape === 'emoji' ? `${p.size}px` : undefined,
                width: p.shape !== 'emoji' ? `${p.size / 2}px` : undefined,
                height: p.shape !== 'emoji' ? `${p.size / 2}px` : undefined,
                backgroundColor: p.shape !== 'emoji' ? p.color : undefined,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0%' : '15%',
              }}
            >
              {p.shape === 'emoji' ? p.emojiText : null}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* PREMIUM RETRO BRAND HEADER */}
        <header className="text-center mb-8">
          <div className="inline-block bg-[#F43F5E] text-white px-6 py-2 rounded-full font-display font-black text-sm tracking-widest uppercase mb-3 shadow-[0_4px_0_#9F1239] border-3 border-[#1F2937] animate-pulse">
            🍔 DINNER DASH
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-[#1F2937] uppercase leading-none">
            What Should We Eat?
          </h1>
          <p className="text-sm md:text-base text-stone-600 mt-2 font-sans font-medium max-w-md mx-auto leading-relaxed">
            Can't agree? Find your mood in 3 steps and let the mechanical spinner lock your next Mumbai legendary feast!
          </p>
        </header>

        {/* 2-COLUMN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: DECISION CORE PIPELINE & SPIN ENGINE (7-cols) */}
          <div className="lg:col-span-7 col-span-1 space-y-6">

            {/* THE CULINARY DECISION PIPELINE (3-STEPS WIZARD) */}
            <div className="bg-white rounded-3xl border-4 border-[#1F2937] shadow-[6px_6px_0_#1F2937] p-5 md:p-6 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-stone-100 pointer-events-none">
                <Compass className="w-16 h-16" />
              </div>

              <div className="flex items-center gap-2 border-b-3 border-[#1F2937] pb-3">
                <Sliders className="w-5 h-5 text-orange-500 animate-pulse" />
                <h2 className="text-lg font-display font-black text-[#1F2937] uppercase tracking-wide">
                  Culinary Mood Selection
                </h2>
              </div>

              {/* STEP 1: SELECT AMBIENCE VIBE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-mono text-[10px] font-black">1</span>
                    Ambience Vibe:
                  </span>
                  {selectedVibe && (
                    <button 
                      onClick={() => setSelectedVibe(null)} 
                      className="text-[10px] text-rose-500 font-bold uppercase hover:underline cursor-pointer"
                    >
                      Clear Vibe
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Street Food Stall', emoji: '🍢' },
                    { label: 'Casual Dining', emoji: '🍛' },
                    { label: 'Fine Dining', emoji: '🏛️' },
                    { label: 'Cozy Cafe', emoji: '☕' },
                    { label: 'Irani Cafe Vibe', emoji: '🥐' }
                  ].map((item) => {
                    const isSelected = selectedVibe === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedVibe(isSelected ? null : item.label)}
                        className={`p-2 rounded-2xl border-2 border-[#1F2937] text-xs font-black tracking-tight text-left transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-350 text-[#1F2937] shadow-[2px_2px_0_#1F2937] translate-y-[-1px]' 
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 active:translate-y-[1px]'
                        }`}
                      >
                        <span className="text-base">{item.emoji}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setSelectedVibe(null)}
                    className={`p-2 rounded-2xl border-2 border-[#1F2937] text-xs font-black tracking-tight text-left transition-all flex items-center gap-2 cursor-pointer ${
                      selectedVibe === null 
                        ? 'bg-amber-350 text-[#1F2937] shadow-[2px_2px_0_#1F2937] translate-y-[-1px]' 
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 active:translate-y-[1px]'
                    }`}
                  >
                    <span className="text-base">🌟</span>
                    <span>All Vibes</span>
                  </button>
                </div>
              </div>

              {/* STEP 2: SELECT PRICE RANGE */}
              <div className="space-y-2 pt-3 border-t border-dashed border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-mono text-[10px] font-black">2</span>
                    Budget / Price Range:
                  </span>
                  {selectedPrice && (
                    <button 
                      onClick={() => setSelectedPrice(null)} 
                      className="text-[10px] text-rose-500 font-bold uppercase hover:underline cursor-pointer"
                    >
                      Clear Budget
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: '₹', desc: '₹ Budget (Street)' },
                    { val: '₹₹', desc: '₹₹ Mid-Range' },
                    { val: '₹₹₹', desc: '₹₹₹ Premium' }
                  ].map((p) => {
                    const isSelected = selectedPrice === p.val;
                    return (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setSelectedPrice(isSelected ? null : p.val)}
                        className={`p-2 rounded-2xl border-2 border-[#1F2937] text-xs font-black tracking-tight transition-all text-center cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-300 text-stone-900 shadow-[2px_2px_0_#1F2937] translate-y-[-1px]' 
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 active:translate-y-[1px]'
                        }`}
                      >
                        <span className="text-xs">{p.desc}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setSelectedPrice(null)}
                    className={`p-2 rounded-2xl border-2 border-[#1F2937] text-xs font-black tracking-tight transition-all text-center cursor-pointer ${
                      selectedPrice === null 
                        ? 'bg-emerald-300 text-stone-900 shadow-[2px_2px_0_#1F2937] translate-y-[-1px]' 
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 active:translate-y-[1px]'
                    }`}
                  >
                    <span>💰 All Budgets</span>
                  </button>
                </div>
              </div>

              {/* STEP 3: CHOOSE CUISINE TYPES (OPTIONAL) */}
              <div className="space-y-2 pt-3 border-t border-dashed border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-mono text-[10px] font-black">3</span>
                    <span>What Type of Food? <span className="text-[10px] font-bold text-stone-400 font-sans lowercase italic">(completely optional)</span></span>
                  </span>
                  {selectedFoodCategories.length > 0 && (
                    <button 
                      onClick={() => setSelectedFoodCategories([])} 
                      className="text-[10px] text-rose-500 font-bold uppercase hover:underline cursor-pointer"
                    >
                      Clear All Food
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {availableCuisinesForStep3.map((cat) => {
                    const isSelected = selectedFoodCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedFoodCategories(prev => prev.filter(c => c !== cat));
                          } else {
                            setSelectedFoodCategories(prev => [...prev, cat]);
                          }
                        }}
                        className={`px-3 py-1.5 text-xs font-black border-2 border-[#1F2937] rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-400 text-stone-900 shadow-[2px_2px_0_#1F2937] translate-y-[-1px]'
                            : 'bg-white text-stone-700 hover:bg-stone-50 active:translate-y-[1px]'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{cat}
                      </button>
                    );
                  })}
                </div>

                {/* Filter explanation feedback */}
                <div className="text-[10px] font-mono text-stone-500 bg-stone-50 p-2 rounded-xl flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  {selectedFoodCategories.length > 0 ? (
                    <span>Spinning only spots matching <b>{selectedFoodCategories.join(", ")}</b> inside your chosen vibe & budget parameters.</span>
                  ) : (
                    <span>No specialties chosen: Spinner runs <b>all</b> available food categories matching your Vibe and Budget!</span>
                  )}
                </div>
              </div>
            </div>

            {/* MECHANICAL SLOT WHEEL CHOOSE WINDOW */}
            <div className="bg-white rounded-3xl border-4 border-[#1F2937] shadow-[8px_8px_0_#1F2937] p-5 md:p-6 relative overflow-hidden" id="chooser-card">
              <div className="absolute top-0 right-0 p-2 text-stone-100 pointer-events-none">
                <Sparkles className="w-24 h-24" />
              </div>

              <div className="relative z-10 space-y-4">
                
                 {/* Spinner Top Info */}
                <div className="flex items-center justify-between gap-2 border-b border-dashed border-stone-200 pb-2">
                  <span className="text-xs font-mono tracking-wider text-stone-500 uppercase flex items-center gap-1.5 min-w-0">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        spinnerStage === 'spinning_cuisine' ? 'bg-orange-400' : 
                        spinnerStage === 'spinning_restaurant' ? 'bg-emerald-400' : 
                        spinnerStage === 'completed' ? 'bg-green-500' : 'bg-amber-400'
                      } opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        spinnerStage === 'spinning_cuisine' ? 'bg-orange-500' : 
                        spinnerStage === 'spinning_restaurant' ? 'bg-emerald-500' : 
                        spinnerStage === 'completed' ? 'bg-green-600' : 'bg-amber-500'
                      }`}></span>
                    </span>
                    <span className="truncate">
                      {spinnerStage === 'spinning_cuisine' ? '🎰 Reel 1: Cuisine Decider Rolling...' :
                       spinnerStage === 'spinning_restaurant' ? '📍 Reel 2: Munch Spot Rolling...' :
                       spinnerStage === 'completed' ? '🏆 Feast Determined!' :
                       'Slot Reels Active'}
                    </span>
                  </span>
                  
                  {/* sound setting toggle */}
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? "Mute Slot Sound Effects" : "Unmute Slot Sound Effects"}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black font-mono border-2 border-[#1F2937] rounded-xl bg-white shadow-[1.5px_1.5px_0_#1F2937] text-stone-700 hover:bg-stone-50 transition-all cursor-pointer flex-shrink-0"
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        <span className="hidden sm:inline text-[#1F2937]">Sound On</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                        <span className="hidden sm:inline text-stone-500">Sound Off</span>
                      </>
                    )}
                  </button>
                </div>

                {/* TWO-REEL MECHANICAL SLOT VIEWPORT CABINET */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* REEL A: CUISINE decider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-black font-sans uppercase tracking-widest text-[#1F2937] flex items-center gap-1">
                        <span>🎰</span> 1. Cuisine Specialty Decider
                      </span>
                      {cuisineWinner && (
                        <span className="text-[9px] font-black text-amber-600 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-full uppercase">
                          LOCKED
                        </span>
                      )}
                    </div>

                    <div className="relative overflow-hidden h-32 bg-stone-950 rounded-2xl flex flex-col items-center justify-center border-4 border-orange-500/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)] px-4 text-center">
                      
                      {/* Authentic shading shadows */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black via-black/60 to-transparent z-10 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />
                      
                      {/* Horizontal target bounds marker */}
                      <div className="absolute inset-y-6 left-2 right-2 border-y-2 border-dashed border-orange-500/10 pointer-events-none z-10" />
                      
                      <div className="absolute left-0 w-2.5 h-6 bg-orange-500 rounded-r-md top-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_#f59e0b] z-20" />
                      <div className="absolute right-0 w-2.5 h-6 bg-orange-500 rounded-l-md top-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_#f59e0b] z-20" />

                      {cuisineReelSequence.length === 0 ? (
                        <div className="text-sm md:text-base font-display font-black tracking-tight text-amber-500 animate-pulse uppercase flex items-center gap-1.5">
                          <span>🎯</span> REEL 1 READY
                        </div>
                      ) : (
                        <div className="h-16 relative w-full overflow-hidden">
                          <motion.div
                            key={spinCount}
                            initial={{ y: 0, filter: "blur(0px)" }}
                            animate={{ 
                              y: (spinnerStage === 'spinning_restaurant' || spinnerStage === 'completed') ? -(32 * 64) : (spinnerStage === 'spinning_cuisine' ? -(32 * 64) : 0),
                              filter: spinnerStage === 'spinning_cuisine' 
                                ? ["blur(0px)", "blur(10px)", "blur(5px)", "blur(0px)"]
                                : "blur(0px)"
                            }}
                            transition={{
                              duration: spinnerStage === 'spinning_cuisine' ? 2.1 : 0.2,
                              ease: [0.15, 0.85, 0.22, 1]
                            }}
                            className="flex flex-col select-none w-full"
                          >
                            {cuisineReelSequence.map((cat, idx) => (
                              <div 
                                key={idx} 
                                className={`h-16 flex items-center justify-center text-center font-display font-black text-xs sm:text-sm md:text-base tracking-tight px-1 transition-all duration-300 w-full truncate ${
                                  idx === 32 && (spinnerStage === 'spinning_restaurant' || spinnerStage === 'completed') && cuisineWinner 
                                    ? 'text-amber-400 scale-105 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' 
                                    : 'text-stone-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]'
                                }`}
                              >
                                <span className="truncate max-w-full">✨ {cat}</span>
                              </div>
                            ))}
                          </motion.div>
                        </div>
                      )}

                      {spinnerStage === 'spinning_cuisine' && (
                        <div className="absolute bottom-1.5 px-3 py-0.5 bg-orange-500 text-stone-950 font-mono text-[9px] font-black tracking-widest rounded uppercase z-10 animate-bounce">
                          ROTATING CATEGORIES...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* REEL B: SPECIFIC RESTAURANT decider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-black font-sans uppercase tracking-widest text-[#1F2937] flex items-center gap-1">
                        <span>📍</span> 2. Specific munch spot
                      </span>
                      {winner && (
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-full uppercase">
                          DECIDED
                        </span>
                      )}
                    </div>

                    <div className="relative overflow-hidden h-32 bg-stone-950 rounded-2xl flex flex-col items-center justify-center border-4 border-amber-400 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)] px-4 text-center">
                      
                      {/* Authentic shading shadows */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black via-black/60 to-transparent z-10 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />
                      
                      {/* Horizontal target bounds marker */}
                      <div className="absolute inset-y-6 left-2 right-2 border-y-2 border-dashed border-amber-500/10 pointer-events-none z-10" />
                      
                      <div className="absolute left-0 w-2.5 h-6 bg-amber-400 rounded-r-md top-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_#f59e0b] z-20" />
                      <div className="absolute right-0 w-2.5 h-6 bg-amber-400 rounded-l-md top-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_#f59e0b] z-20" />

                      {spinnerStage === 'idle' ? (
                        <div className="text-xs font-mono font-bold tracking-wider text-stone-500 uppercase">
                          <span>⚡ STANDBY...</span>
                        </div>
                      ) : spinnerStage === 'spinning_cuisine' ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          <span className="text-[10px] font-mono text-emerald-500/60 animate-pulse font-extrabold tracking-wider">AWAITING CODES LOCK...</span>
                          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce rounded-full" />
                        </div>
                      ) : restaurantReelSequence.length === 0 ? (
                        <div className="text-xs font-mono font-bold tracking-wider text-rose-500/80 uppercase">
                          <span>⚡ PREPARING REEL...</span>
                        </div>
                      ) : (
                        <div className="h-16 relative w-full overflow-hidden">
                          <motion.div
                            key={restaurantSpinCount}
                            initial={{ y: 0, filter: "blur(0px)" }}
                            animate={{ 
                              y: spinnerStage === 'completed' ? -(32 * 64) : (spinnerStage === 'spinning_restaurant' ? -(32 * 64) : 0),
                              filter: spinnerStage === 'spinning_restaurant' 
                                ? ["blur(0px)", "blur(12px)", "blur(6px)", "blur(0px)"]
                                : "blur(0px)"
                            }}
                            transition={{
                              duration: spinnerStage === 'spinning_restaurant' ? 2.3 : 0.2,
                              ease: [0.15, 0.85, 0.22, 1]
                            }}
                            className="flex flex-col select-none w-full"
                          >
                            {restaurantReelSequence.map((item, idx) => (
                              <div 
                                key={idx} 
                                className={`h-16 flex items-center justify-center text-center font-display font-black text-xs sm:text-xs md:text-sm tracking-tight px-1 transition-all duration-300 w-full truncate ${
                                  idx === 32 && spinnerStage === 'completed' && winner 
                                    ? 'text-emerald-400 scale-105 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]' 
                                    : 'text-stone-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]'
                                }`}
                              >
                                <span className="truncate max-w-full">🍽️ {item.name}</span>
                              </div>
                            ))}
                          </motion.div>
                        </div>
                      )}

                      {spinnerStage === 'spinning_restaurant' && (
                        <div className="absolute bottom-1.5 px-3 py-0.5 bg-amber-400 text-stone-950 font-mono text-[9px] font-black tracking-widest rounded uppercase z-10 animate-bounce">
                          DECIDING VENUE...
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Pool summary list match validation alerts */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-stone-500 font-bold">
                    Active matching spots: <span className="text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded font-black font-mono">{itemsWithOdds.length}</span>
                  </span>
                  {itemsWithOdds.length < 2 && (
                    <span className="text-rose-600 text-[10px] font-black animate-pulse flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Need at least 2 to spin!
                    </span>
                  )}
                </div>

                {/* SPIN ACTION BUTTON */}
                <button
                  type="button"
                  onClick={startDecisionSpin}
                  disabled={isSpinning || itemsWithOdds.length < 2}
                  className={`relative overflow-hidden w-full py-5 px-8 rounded-full font-display text-xl md:text-2xl font-black tracking-tight border-4 border-[#1F2937] flex items-center justify-center gap-2.5 outline-none transition-all duration-150 transform ${
                    itemsWithOdds.length < 2 
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none border-dashed'
                      : 'bg-[#F43F5E] hover:bg-[#E11D48] text-white cursor-pointer shadow-[0_12px_0_#9F1239] hover:translate-y-1 hover:shadow-[0_8px_0_#9F1239] active:translate-y-2.5 active:shadow-[0_2px_0_#9F1239]'
                  }`}
                >
                  {isSpinning ? (
                    <>
                      <Shuffle className="w-6 h-6 animate-spin text-white" />
                      <span>SPINNING CHAT ENGINE...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
                      <span>SPIN TO END THE DEBATE!</span>
                    </>
                  )}
                </button>

                {/* WINNER DRAWER CELL */}
                <AnimatePresence>
                  {winner && !isSpinning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#FEF3C7] border-3 border-amber-400 rounded-2xl p-4 text-center relative shadow-inner">
                        <span className="inline-flex self-center bg-[#FDE68A] border-2 border-[#1F2937] text-amber-900 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-1">
                          👑 Culinary Winner Selected 👑
                        </span>
                        
                        <h3 className="text-2xl md:text-3xl font-display font-black text-stone-900 mt-2">
                          {winner.name}
                        </h3>

                        <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5 mb-3.5 text-[10px] font-black uppercase tracking-wide">
                          <span className="bg-white border-2 border-[#1F2937] text-stone-700 px-2 py-0.5 rounded-lg">
                            {winner.ambience}
                          </span>
                          <span className="bg-amber-100 border-2 border-amber-300 text-amber-900 px-2 py-0.5 rounded-lg">
                            💰 Budget: {winner.priceRange}
                          </span>
                          {winner.rating && (
                            <span className="bg-emerald-100 border-2 border-emerald-300 text-emerald-900 px-2 py-0.5 rounded-lg">
                              ⭐ Rating: {winner.rating}
                            </span>
                          )}
                        </div>

                        {winner.address && (
                          <div className="text-xs text-stone-600 font-medium mb-4 flex items-center justify-center gap-1.5 bg-white border-2 border-stone-200 p-2 rounded-xl">
                            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                            <span className="truncate">{winner.address}</span>
                          </div>
                        )}

                        {/* WINNER ACTION ROW */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(winner.name.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, ""))}+Mumbai`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2.5 px-3 bg-stone-900 hover:bg-stone-950 border-2 border-stone-900 text-white font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span>Navigate Location</span>
                          </a>

                          <button
                            type="button"
                            onClick={handleCopyOutcome}
                            className="py-2.5 px-3 bg-white hover:bg-stone-50 border-2 border-stone-200 text-stone-700 font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            {hasCopied ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700 font-black">Copied Spot!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 text-stone-500" />
                                <span>Copy Details</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleVetoCurrentWinner}
                            className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border-2 border-rose-350 text-rose-700 font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            <span>Veto (Roll Again)</span>
                          </button>
                        </div>

                        {/* Top corner cross close */}
                        <button
                          type="button"
                          onClick={() => setWinner(null)}
                          className="absolute top-2.5 right-2.5 p-1 text-amber-800 hover:text-amber-950 transition-colors"
                          aria-label="Close Winning Popup"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* INPUT PANEL: ADD CUSTOM POSSIBILITIES */}
            <section className="bg-white rounded-3xl border-4 border-[#1F2937] shadow-[6px_6px_0_#1F2937] p-5 md:p-6 space-y-4">
              <h2 className="text-lg font-display font-black text-[#1F2937] flex items-center gap-2 uppercase tracking-wide border-b-2 border-stone-100 pb-2">
                <PlusCircle className="w-5 h-5 text-emerald-500 animate-pulse" />
                <span>Add Your Custom Food Spots</span>
              </h2>

              {/* Preset Loading Badges */}
              <div>
                <span className="text-[11px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                  💡 Tap quick presets to load:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CUISINES.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddPreset(p)}
                      className="px-2 py-1 text-[11px] bg-[#FED7AA] hover:bg-[#FDBA74] text-stone-800 border-2 border-[#1F2937] font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <span>{p.emoji}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddCustomRestaurant} className="space-y-3.5 pt-2">
                
                {/* Input with Dice Suggestion */}
                <div className="relative">
                  <input
                    type="text"
                    value={newRestaurantName}
                    onChange={(e) => setNewRestaurantName(e.target.value)}
                    placeholder="Enter custom restaurant name..."
                    maxLength={40}
                    className="w-full pr-12 pl-4 py-3 bg-white border-3 border-[#1F2937] rounded-xl font-sans text-xs font-semibold text-stone-900 placeholder-stone-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGetInspiration}
                    title="Generate random Mumbai foodie idea!"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-amber-650 cursor-pointer"
                  >
                    <Dices className="w-4 h-4 animate-bounce" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Category dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Food Category:</label>
                    <select
                      value={newRestaurantCategory}
                      onChange={(e) => setNewRestaurantCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#1F2937] rounded-xl font-sans text-xs font-bold text-stone-700 focus:outline-none cursor-pointer"
                    >
                      {availableCuisinesForStep3.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="Custom">Custom / Other</option>
                    </select>
                  </div>

                  {/* Ambience Vibe selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Ambience:</label>
                    <select
                      value={newRestaurantAmbience}
                      onChange={(e) => setNewRestaurantAmbience(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#1F2937] rounded-xl font-sans text-xs font-bold text-stone-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Street Food Stall">Street Food Stall</option>
                      <option value="Casual Dining">Casual Dining</option>
                      <option value="Fine Dining">Fine Dining</option>
                      <option value="Cozy Cafe">Cozy Cafe</option>
                      <option value="Irani Cafe Vibe">Irani Cafe Vibe</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Price dropdown */}
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Price Range:</label>
                    <select
                      value={newRestaurantPrice}
                      onChange={(e) => setNewRestaurantPrice(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#1F2937] rounded-xl font-sans text-xs font-bold text-stone-700 focus:outline-none cursor-pointer"
                    >
                      <option value="₹">₹ Budget / Cheap</option>
                      <option value="₹₹">₹₹ Moderate / Mid</option>
                      <option value="₹₹₹">₹₹₹ Splurge / Premium</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Address Location:</label>
                    <input
                      type="text"
                      value={newRestaurantAddress}
                      onChange={(e) => setNewRestaurantAddress(e.target.value)}
                      placeholder="e.g. Hill Road, Bandra West, Mumbai"
                      className="w-full px-3 py-1.5 bg-white border-2 border-[#1F2937] rounded-xl font-sans text-xs font-semibold text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white border-3 border-[#1F2937] font-display text-xs font-black uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0_#064e3b] active:translate-y-[1px] active:shadow-none"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  <span>Add Customized Spot to Pool</span>
                </button>
              </form>
            </section>

            {/* CHOICE DECISION HISTORY LOGS */}
            <section className="bg-white rounded-3xl border-4 border-[#1F2937] shadow-[6px_6px_0_#1F2937] p-4 md:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h2 className="text-sm font-display font-black text-stone-900 flex items-center gap-2 uppercase tracking-wide">
                  <History className="w-4 h-4 text-stone-500" />
                  <span>Decision History Logs</span>
                </h2>
                
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-[10px] font-black text-rose-500 hover:underline cursor-pointer flex items-center gap-1 uppercase"
                  >
                    <span>Clear Logs</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {history.length > 0 ? (
                    history.map((log) => {
                      const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-2.5 rounded-xl border-2 border-[#1F2937] flex items-center justify-between gap-3 text-xs shadow-[1.5px_1.5px_0_#1F2937] ${
                            log.vetoed 
                              ? 'bg-rose-100/60 text-rose-700 opacity-70' 
                              : 'bg-[#FFF7ED] text-stone-800'
                          }`}
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${log.vetoed ? 'text-rose-400' : 'text-stone-400'}`} />
                            <span className={`font-sans font-bold truncate ${log.vetoed ? 'line-through text-rose-500 font-medium' : 'text-stone-800'}`}>
                              {log.restaurantName}
                            </span>
                            {log.vetoed && (
                              <span className="text-[8px] bg-rose-150 border border-rose-300 text-rose-600 px-1.5 py-0.2 rounded-full font-black">
                                VETOED
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[9px] font-mono font-bold text-stone-400">
                              {logTime}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => handleDeleteHistoryItem(log.id)}
                              className="p-1 text-stone-400 hover:text-stone-600 rounded transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-stone-400 text-xs">
                      <p>Your logs are clear. Choose what we eat to trigger history!</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: MAP CONTAINER & CORE DATABASE VIEWER (5-cols) */}
          <div className="lg:col-span-5 col-span-1 space-y-6">

            {/* LIVE MUMBAI CULINARY MAP TRACKER */}
            <div className="bg-white rounded-3xl border-4 border-[#1F2937] shadow-[6px_6px_0_#1F2937] p-4 relative overflow-hidden" ref={mapContainerRef}>
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                <span className="text-xs font-black text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
                  <MapIcon className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span>Mumbai Culinary Spot Map</span>
                </span>
                <span className="text-[9px] font-mono font-bold bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded text-blue-700">
                  {hasValidKey ? "● Google Map Active" : "📍 Free Interactive Map (no key needed)"}
                </span>
              </div>

              {/* RENDER ACTUAL MAP OR SIMULATED FALLBACK MAP */}
              <div className="w-full relative h-[380px] rounded-2xl bg-stone-950 overflow-hidden border-2 border-[#1F2937]">
                {hasValidKey ? (
                  // REAL REGISTERED GOOGLE MAP PLATFORM CANVAS
                  <APIProvider apiKey={API_KEY} version="weekly">
                    <GoogleMap
                      defaultCenter={{ lat: 19.03, lng: 72.84 }}
                      defaultZoom={11.5}
                      mapId="DEMO_MAP_ID"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {/* Plot filtered matching pool restaurants */}
                      {itemsWithOdds.map(res => {
                        if (!res.latitude || !res.longitude) return null;
                        const isWinner = winner && winner.id === res.id;
                        return (
                          <AdvancedMarker
                            key={res.id}
                            position={{ lat: res.latitude, lng: res.longitude }}
                            onClick={() => setSelectedOnMap(res)}
                          >
                            <GooglePin
                              background={isWinner ? "#10B981" : (res.favorite ? "#FBBF24" : "#F43F5E")}
                              borderColor="#1F2937"
                              glyphColor="#fff"
                            />
                          </AdvancedMarker>
                        );
                      })}

                      {/* Info popup window */}
                      {selectedOnMap && selectedOnMap.latitude && selectedOnMap.longitude && (
                        <GoogleInfoWindow
                          position={{ lat: selectedOnMap.latitude, lng: selectedOnMap.longitude }}
                          onCloseClick={() => setSelectedOnMap(null)}
                        >
                          <div className="p-1 font-sans text-stone-900 max-w-xs text-xs">
                            <div className="flex items-center gap-1 font-extrabold text-sm mb-1">
                              <span>{selectedOnMap.name}</span>
                              {selectedOnMap.rating && (
                                <span className="text-amber-500 font-mono text-[9px] bg-amber-50 px-1 py-0.2 rounded font-black">
                                  ⭐ {selectedOnMap.rating}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-500">
                              {selectedOnMap.category} • {selectedOnMap.ambience} • {selectedOnMap.priceRange}
                            </p>
                            <p className="text-[10px] text-emerald-600 italic font-bold mt-1">
                              {selectedOnMap.address}
                            </p>
                          </div>
                        </GoogleInfoWindow>
                      )}
                    </GoogleMap>
                  </APIProvider>
                ) : (
                  // BEAUTIFUL KEYLESS INTERACTIVE MAP EXPERIENCE VIA OPENSTREETMAPtilelayer
                  <LeafletMap
                    restaurants={itemsWithOdds}
                    winner={winner}
                    selectedOnMap={selectedOnMap}
                    setSelectedOnMap={setSelectedOnMap}
                  />
                )}
              </div>
            </div>

            {/* CURATED COMBINED DATABASE LIST & CONTROLLER */}
            <section className="bg-white rounded-3xl border-4 border-[#1F2937] shadow-[6px_6px_0_#1F2937] p-4 md:p-5">
              
              <div className="flex flex-col gap-2 pb-3 border-b border-stone-100 mb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-display font-black text-[#1F2937] flex items-center gap-1.5 uppercase tracking-wide">
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    <span>Database Configuration</span>
                  </h2>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500">
                    <span>Total: <b>{restaurants.length}</b></span>
                    <span>|</span>
                    <button 
                      onClick={handleResetToPresets}
                      className="text-orange-500 hover:underline font-bold flex items-center gap-0.5 cursor-pointer uppercase"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Reset
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500">
                  Toggle inclusion checks or give 3x odds boost with fire/craving status. Double-click names to rename!
                </p>
              </div>

              {/* Filters search and tabs list */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search database spots..."
                    className="w-full pl-8 pr-8 py-1.5 bg-stone-50 border border-stone-250 rounded-lg font-sans text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Tab layout selector */}
                {categoriesList.length > 2 && (
                  <div className="flex gap-1 overflow-x-auto py-0.5 max-w-full">
                    {categoriesList.map((tab, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveCategoryTab(tab)}
                        className={`px-2 py-0.75 text-[10px] font-sans font-bold rounded-md whitespace-nowrap border cursor-pointer transition-colors ${
                          activeCategoryTab === tab 
                            ? 'bg-stone-900 border-stone-900 text-white' 
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-105'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Core list grid scroll area */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 bg-stone-50/45 rounded-xl p-2 border border-stone-100">
                <AnimatePresence initial={false}>
                  {filteredConfigRestaurants.length > 0 ? (
                    filteredConfigRestaurants.map((res) => {
                      // Dynamic probability calculation inside current selection
                      const likelihoodOdds = itemsWithOdds.find(o => o.id === res.id);
                      const outputOdds = likelihoodOdds ? likelihoodOdds.odds.toFixed(1) : '0.0';

                      // Check if matches the active Step filters
                      const matchesVibe = !selectedVibe || res.ambience === selectedVibe;
                      const matchesPrice = !selectedPrice || res.priceRange === selectedPrice;
                      const matchesFood = selectedFoodCategories.length === 0 || 
                                          (res.category && selectedFoodCategories.includes(res.category));
                      const isMatchingStepSelector = matchesVibe && matchesPrice && matchesFood && res.active;

                      const getColorTheme = (color?: string) => {
                        switch (color) {
                          case 'orange': return 'bg-[#FED7AA]';
                          case 'rose': 
                          case 'pink': 
                          case 'red': return 'bg-[#FBCFE8]';
                          case 'amber': 
                          case 'yellow': return 'bg-[#FDE68A]';
                          case 'emerald': 
                          case 'green': return 'bg-[#A7F3D0]';
                          case 'sky': 
                          case 'blue': return 'bg-[#BAE6FD]';
                          case 'indigo': 
                          case 'purple': return 'bg-[#DDD6FE]';
                          default: return 'bg-[#FDE68A]';
                        }
                      };

                      return (
                        <motion.div
                          key={res.id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -15 }}
                          className={`p-2.5 rounded-xl border-2 border-[#1F2937] flex flex-col gap-1.5 transition-all ${
                            res.active 
                              ? `${getColorTheme(res.color)} text-stone-900 shadow-[2px_2px_0_#1F2937]` 
                              : 'bg-stone-100 dark:bg-stone-150/70 text-stone-400 opacity-65 border-dashed shadow-none'
                          }`}
                        >
                          {/* Row 1: Checkbox & Name Title */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(res.id)}
                                className="cursor-pointer flex-shrink-0"
                                aria-label={res.active ? "Enable spot" : "Disable spot"}
                              >
                                <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border-2 border-[#1F2937] ${
                                  res.active ? 'bg-stone-900 text-white' : 'bg-white text-transparent'
                                }`}>
                                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                </div>
                              </button>

                              {editingId === res.id ? (
                                <input
                                  type="text"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  onBlur={() => handleSaveEdit(res.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit(res.id);
                                  }}
                                  autoFocus
                                  className="bg-white px-1.5 py-0.5 text-xs text-stone-800 rounded border border-stone-300 outline-none max-w-full font-bold"
                                />
                              ) : (
                                <span 
                                  onDoubleClick={() => handleStartEdit(res)}
                                  className={`text-xs font-bold font-sans truncate cursor-pointer hover:underline decoration-stone-500 decoration-dashed ${
                                    res.active ? 'text-stone-900' : 'text-stone-400 line-through'
                                  }`}
                                  title="Double click to rename!"
                                >
                                  {res.name}
                                </span>
                              )}
                              
                              {res.favorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0 animate-pulse" />}
                            </div>

                            {/* Active Selector Indicator Light */}
                            {res.active && (
                              <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.4 border rounded flex items-center gap-0.5 ${
                                isMatchingStepSelector 
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse' 
                                  : 'bg-stone-105 text-stone-400 border-stone-250'
                              }`}>
                                {isMatchingStepSelector ? "In Spin Pool" : "Filtered Out"}
                              </span>
                            )}
                          </div>

                          {/* Row 2: Tag Badges & Buttons */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-dashed border-[#1F2937]/10 text-[9px]">
                            
                            {/* Metadata list */}
                            <div className="flex flex-wrap items-center gap-1 text-stone-500 font-bold">
                              <span>{res.category}</span>
                              <span>•</span>
                              <span>{res.ambience}</span>
                              <span>•</span>
                              <span className="text-[#1F2937] font-black">{res.priceRange}</span>
                            </div>

                            {/* Options controls */}
                            <div className="flex items-center gap-1.5">
                              {/* Likelihood metric */}
                              {isMatchingStepSelector && (
                                <span className="font-mono text-[9.5px] font-black text-rose-600 bg-white border border-[#1F2937] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xxs">
                                  {outputOdds}%
                                </span>
                              )}

                              {/* Favorite check */}
                              <button
                                type="button"
                                onClick={() => handleToggleFavorite(res.id)}
                                className={`p-1 rounded border border-[#1F2937] active:translate-y-[1px] transition-all cursor-pointer ${
                                  res.favorite ? 'bg-amber-300 text-stone-900' : 'bg-white text-stone-400'
                                }`}
                              >
                                <Star className="w-3 h-3" />
                              </button>

                              {/* Craving Check */}
                              {res.active && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleCraving(res.id)}
                                  className={`p-1 rounded border border-[#1F2937] active:translate-y-[1px] transition-all cursor-pointer ${
                                    res.craving ? 'bg-orange-500 text-white' : 'bg-white text-stone-500'
                                  }`}
                                  title="Toggle double odds weight craving status!"
                                >
                                  <Flame className="w-3 h-3" />
                                </button>
                              )}

                              {/* Trash Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteRestaurant(res.id)}
                                className="p-1 bg-white hover:bg-rose-50 border border-[#1F2937] text-stone-700 hover:text-rose-500 rounded active:translate-y-[1px] transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            
                          </div>

                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-stone-400 text-xs">
                      No options found in this tab. Clear searches!
                    </div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {restaurants.length === 0 && (
                <div className="text-center py-8 bg-stone-50 border-2 border-dashed border-[#1F2937]/10 rounded-xl">
                  <p className="text-xs text-stone-400 mb-2">Configure list is empty.</p>
                  <button 
                    onClick={handleResetToPresets}
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-950 text-white font-sans text-xs font-black rounded-xl"
                  >
                    Restore default Mumbai spots
                  </button>
                </div>
              )}

            </section>

          </div>

        </div>

        {/* Informative advice footer */}
        <footer className="text-center mt-10 text-[11px] font-sans text-stone-400 leading-relaxed max-w-md mx-auto space-y-1.5">
          <p>
            No coordinates tracking cookie or user log databases used. Your culinary presets, configurations and favorites are stored 100% privately in your local browser storage.
          </p>
          <p>© 2026 Dinner Dash Companion. Happy Munching! 🥥🍛</p>
        </footer>

      </div>
    </div>
  );
}
