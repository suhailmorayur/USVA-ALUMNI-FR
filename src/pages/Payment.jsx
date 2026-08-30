import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { CreditCard, ShieldCheck, AlertCircle, Loader2, Camera, CheckCircle2, Copy } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract memberId from query parameter
  const queryParams = new URLSearchParams(location.search);
  const memberId = queryParams.get('id');

  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(500);
  const [upiId, setUpiId] = useState('bdllubaid@okhdfcbank');
  const [payeeName, setPayeeName] = useState('Ubaidulla A');
  const [error, setError] = useState('');
  const [member, setMember] = useState(null);

  // Payment proof form states
  const [utr, setUtr] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountPaid, setAmountPaid] = useState(500);
  const [screenshotRaw, setScreenshotRaw] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotPublicId, setScreenshotPublicId] = useState('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [submittingProof, setSubmittingProof] = useState(false);

  // Fetch campaign settings & member details
  useEffect(() => {
    if (!memberId) {
      navigate('/', { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch Settings
        const settingsRes = await axios.get('/api/settings');
        if (settingsRes.data.success) {
          const s = settingsRes.data.data;
          setFee(s.membershipFee);
          setAmountPaid(s.membershipFee);
          setUpiId(s.upiId || 'usva@upi');
          setPayeeName(s.payeeName || 'USVA Alumni');
        }
        
        // Fetch Member details to confirm profile exists
        const memberRes = await axios.get(`/api/members/${memberId}`);
        if (memberRes.data.success) {
          setMember(memberRes.data.data.member);
        }
      } catch (err) {
        console.error('Failed to load details:', err);
        setError('Failed to load application details. Please return to home and apply again.');
      }
    };

    fetchData();
  }, [memberId, navigate]);

  // Handle screenshot selection
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Screenshot size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotRaw(reader.result);
      // Auto-upload cropped/raw screenshot base64
      uploadScreenshotToServer(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadScreenshotToServer = async (base64Data) => {
    setUploadingScreenshot(true);
    setError('');
    try {
      const response = await axios.post('/api/members/upload-photo', { photo: base64Data });
      if (response.data.success) {
        setScreenshotUrl(response.data.data.photoUrl);
        setScreenshotPublicId(response.data.data.photoPublicId);
      } else {
        setError('Screenshot upload failed. Please try again.');
        setScreenshotRaw(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Screenshot upload error.');
      setScreenshotRaw(null);
    } finally {
      setUploadingScreenshot(false);
    }
  };

  // Submit payment confirmation with screenshot
  const handleSubmitProof = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!screenshotUrl) {
      setError('Please upload a screenshot of your payment receipt before confirming.');
      return;
    }

    setSubmittingProof(true);

    try {
      const payload = {
        utr: '',
        screenshotUrl,
        screenshotPublicId,
        paymentDate: new Date(),
        amountPaid: Number(fee)
      };

      const response = await axios.post(`/api/payments/submit-proof/${memberId}`, payload);
      if (response.data.success) {
        const { card, member: updatedMember } = response.data.data;
        // Redirect to success page and pass card PDF URL and membership details
        navigate('/payment/success', { 
          state: { 
            pdfUrl: card.pdfUrl, 
            membershipId: card.membershipId,
            fullName: updatedMember.fullName 
          }
        });
      } else {
        setError(response.data.message || 'Payment confirmation failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during confirmation.');
    } finally {
      setSubmittingProof(false);
    }
  };

  // Construct standard UPI deep link string
  const cleanPayeeName = encodeURIComponent(payeeName);
  const upiLink = `upi://pay?pa=${upiId}&pn=${cleanPayeeName}&am=${fee}&cu=INR`;

  const handlePayNowClick = () => {
    // Attempt to open native UPI app deep link
    window.location.href = upiLink;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Title */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <CreditCard className="w-10 h-10 mx-auto mb-2 text-teal-400" />
          <h2 className="text-xl font-bold uppercase tracking-wide">Direct UPI Payment</h2>
          <p className="text-slate-400 text-xs mt-1">Pay the membership fee and upload receipt proof</p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {member && (
            <div className="text-xs bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Applying For:</span>
              <div className="flex justify-between font-bold text-slate-800">
                <span>{member.fullName}</span>
                <span className="text-slate-500 font-medium">Ad. No: {member.admissionNumber}</span>
              </div>
            </div>
          )}

          {/* Payment amount Details */}
          <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100 text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Membership Fee</span>
            <span className="text-4xl font-black text-teal-700">₹{fee}</span>
            <span className="text-[10px] bg-teal-600 px-2 py-0.5 rounded text-white font-bold inline-block uppercase">UPI DIRECT PAY</span>
          </div>

          {/* Interactive QR / GPay Instructions */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            
            {/* Step-by-step Instructions */}
            <div className="w-full text-slate-700 space-y-2.5 text-xs">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider block border-b pb-1 text-center">Payment Steps</span>
              
              <div className="flex gap-2">
                <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                <p className="leading-relaxed">Scan the QR code below using any UPI app (GPay, PhonePe, Paytm, etc.).</p>
              </div>

              <div className="flex gap-2">
                <span className="bg-teal-700 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                <p className="leading-relaxed flex-grow">
                  Or copy the Google Pay (GPay) number below and send the exact fee directly.
                </p>
              </div>
            </div>

            <div className="p-2 bg-white rounded-lg border shadow-sm">
              <QRCodeSVG value={upiLink} size={150} level="M" />
            </div>

            {/* GPay Phone Number & Copy Option */}
            <div className="flex flex-col items-center gap-1 w-full pt-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Google Pay (GPay) Number</span>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-xs">
                <span className="text-sm font-extrabold text-slate-800 font-mono">+91 73562 26704</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('+91 73562 26704');
                    alert('GPay Number copied to clipboard!');
                  }}
                  className="p-1 hover:bg-slate-100 rounded text-teal-600 transition"
                  title="Copy GPay Number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Upload Instruction */}
            <div className="w-full text-center text-[10px] text-slate-500 font-semibold border-t pt-3">
              Take a screenshot of the successful payment receipt, upload it below, and click the confirmation button to activate your card.
            </div>

          </div>

          {/* Direct Confirmation Portal */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Upload Payment Screenshot
            </span>

            <div className="flex flex-col items-center gap-3 bg-slate-50 border border-dashed border-slate-200 p-4 rounded-xl">
              <input
                type="file"
                id="screenshotProof"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="hidden"
              />
              
              {!screenshotRaw ? (
                <label htmlFor="screenshotProof" className="cursor-pointer flex flex-col items-center gap-1 py-2 w-full text-center">
                  <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Receipt Image</span>
                </label>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="relative">
                    <img 
                      src={screenshotRaw} 
                      alt="Receipt preview" 
                      className="w-24 h-24 object-cover border rounded-xl shadow-sm"
                    />
                    {screenshotUrl && (
                      <div className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white rounded-full p-0.5 animate-bounce">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  {uploadingScreenshot ? (
                    <span className="text-xs text-slate-500 animate-pulse font-semibold">Uploading to secure server...</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotRaw(null);
                        setScreenshotUrl('');
                        setScreenshotPublicId('');
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 transition"
                    >
                      Change Image
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmitProof}
              disabled={submittingProof || uploadingScreenshot || !screenshotUrl}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition flex justify-center items-center gap-2 text-sm tracking-wide uppercase disabled:opacity-50"
            >
              {submittingProof ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Alumni Card...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Confirm Payment & Activate Card
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
