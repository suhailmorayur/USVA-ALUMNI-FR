import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Award, ArrowRight, CheckCircle2, UserCheck, ShieldCheck, CreditCard, ChevronRight, Upload, User, MapPin, GraduationCap, Phone, Mail } from 'lucide-react';
import PhotoCrop from '../components/PhotoCrop';

const Home = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [sand, setSand] = useState({ umari: false, faizy: false });
  const [place, setPlace] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPublicId, setPhotoPublicId] = useState('');

  // Image upload/crop states
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePhotoSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setRawImageSrc(reader.result);
        setIsCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async (croppedBase64) => {
    setIsCropping(false);
    setUploadingPhoto(true);
    setError('');

    try {
      // Upload cropped photo to Cloudinary via backend public route
      const response = await axios.post('/api/members/upload-photo', { photo: croppedBase64 });
      if (response.data.success) {
        setPhotoUrl(response.data.data.photoUrl);
        setPhotoPublicId(response.data.data.photoPublicId);
      } else {
        setError('Photo upload failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload photo to server.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !place || !admissionNumber || !phone || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!photoUrl) {
      setError('Please upload and crop a profile photo.');
      return;
    }

    setSubmitting(true);

    // Build selected Sanads
    const selectedSanads = [];
    if (sand.umari) selectedSanads.push('umari');
    if (sand.faizy) selectedSanads.push('faizy');

    try {
      const payload = {
        fullName: fullName.trim(),
        sand: selectedSanads,
        place: place.trim(),
        admissionNumber: admissionNumber.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        photoUrl,
        photoPublicId
      };

      const response = await axios.post('/api/members', payload);
      if (response.data.success) {
        const createdMember = response.data.data;
        // Redirect directly to payment with query parameter ID
        navigate(`/payment?id=${createdMember._id}`);
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-400 tracking-wide">
            <Award className="w-4.5 h-4.5" /> OFFICIAL ALUMNI PLATFORM
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-100">
            USVA Alumni Membership Campaign
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Join the <strong className="text-teal-400 font-semibold">Umariyya Students Venerable Association</strong>, the alumni union of Umarali Shihab Thangal Islamic Academy, Arimbra. Secure your digital membership card instantly.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={scrollToForm}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-teal-900/30 transition transform hover:-translate-y-0.5"
            >
              APPLY NOW <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/download')}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Download Existing Card
            </button>
          </div>
        </div>
      </section>

      {/* Main Form/Application Section */}
      <section ref={formRef} className="py-16 px-4 max-w-4xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-8 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 text-teal-400" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">USVA Alumni Membership Application</h2>
            <p className="text-slate-400 text-xs mt-1">Fill in your official details to compile your Portrait membership card</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-xl text-sm font-semibold">
                Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Photo Upload Inset */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Student Profile Photo</h3>
                
                <div className="relative w-36 h-44 bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300 flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Cropped Student" className="w-full h-full object-cover" />
                  ) : uploadingPhoto ? (
                    <div className="text-xs text-slate-500 animate-pulse font-semibold">Uploading...</div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-4">
                      <Upload className="w-8 h-8 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-400 font-medium">Portrait Photo (Required)</span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input 
                    type="file" 
                    id="photo-upload" 
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <label 
                    htmlFor="photo-upload" 
                    className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-5 rounded-lg text-xs tracking-wider uppercase transition shadow-sm block"
                  >
                    Select Photo
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 text-center max-w-xs leading-normal">
                  For best results, upload a high-resolution headshot. You will crop it to standard card proportions next.
                </p>
              </div>

              {/* Text Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. AHMAD SHIHAB"
                      className="w-full bg-white border border-slate-200 focus:border-teal-700 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/10 transition text-sm font-semibold uppercase"
                    />
                  </div>
                </div>

                {/* Place */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Place</label>
                  <div className="relative">
                    <MapPin className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="text"
                      required
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="e.g. MORAYUR"
                      className="w-full bg-white border border-slate-200 focus:border-teal-700 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/10 transition text-sm font-semibold uppercase"
                    />
                  </div>
                </div>

                {/* Admission Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Admission Number</label>
                  <div className="relative">
                    <GraduationCap className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="text"
                      required
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                      placeholder="e.g. 1098"
                      className="w-full bg-white border border-slate-200 focus:border-teal-700 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/10 transition text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-white border border-slate-200 focus:border-teal-700 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/10 transition text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address (To Receive PDF Card)</label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ahmad@example.com"
                      className="w-full bg-white border border-slate-200 focus:border-teal-700 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/10 transition text-sm font-semibold"
                    />
                  </div>
                </div>

              </div>

              {/* Sanad Checkboxes */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Sanad Degree (If Applicable)</span>
                <div className="flex gap-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={sand.umari}
                      onChange={(e) => setSand({ ...sand, umari: e.target.checked })}
                      className="w-4.5 h-4.5 text-teal-700 border-slate-300 rounded focus:ring-teal-700/20 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700">UMARI</span>
                  </label>
                  
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={sand.faizy}
                      onChange={(e) => setSand({ ...sand, faizy: e.target.checked })}
                      className="w-4.5 h-4.5 text-teal-700 border-slate-300 rounded focus:ring-teal-700/20 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700">FAIZY</span>
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting || uploadingPhoto}
                className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition flex justify-center items-center gap-2 disabled:opacity-50 text-lg"
              >
                {submitting ? 'Registering Application...' : <>Continue to Payment <ArrowRight className="w-5 h-5" /></>}
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* Image Crop Modal Overlay */}
      {isCropping && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <PhotoCrop 
              imageSrc={rawImageSrc}
              onCropComplete={handleCropComplete}
              onCancel={() => setIsCropping(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
