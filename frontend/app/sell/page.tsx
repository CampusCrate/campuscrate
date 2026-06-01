"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { UploadCloud, MapPin, ChevronRight, ChevronLeft, Camera, Info, Tag, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomSelect from "../../components/CustomSelect";
import { useAuth } from "../../lib/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface UploadedImage {
  file: File;
  publicUrl: string;
  previewUrl: string;
  uploading: boolean;
  error?: string;
}

export default function SellPage() {
  const { user, isPending } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [meetupType, setMeetupType] = useState("on-campus");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [meetupLocation, setMeetupLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);


  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const uploadImageToS3 = useCallback(async (file: File) => {
    const token = localStorage.getItem("accessToken");
    
    // 1. Get pre-signed URL from Django
    const res = await fetch(`${API_URL}/api/v1/listings/upload-url/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ file_name: file.name, file_type: file.type }),
    });

    if (!res.ok) throw new Error("Failed to get upload URL");
    const { upload_url, token: uploadToken, public_url } = await res.json();

    // 2. PUT file directly to Supabase Storage
    const uploadRes = await fetch(upload_url, {
      method: "PUT",
      headers: { 
        "Content-Type": file.type,
        "Authorization": `Bearer ${uploadToken}`
      },
      body: file,
    });

    if (!uploadRes.ok) throw new Error("Failed to upload to Supabase Storage");

    return public_url as string;
  }, []);

  const handleImageFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    const newFiles = validFiles.slice(0, 4 - images.length);
    if (!newFiles.length) return;

    const placeholders: UploadedImage[] = newFiles.map((file) => ({
      file,
      publicUrl: "",
      previewUrl: URL.createObjectURL(file),
      uploading: true,
    }));
    setImages((prev) => [...prev, ...placeholders]);

    await Promise.all(
      newFiles.map(async (file, i) => {
        try {
          const publicUrl = await uploadImageToS3(file);
          setImages((prev) =>
            prev.map((img) =>
              img.file === file ? { ...img, publicUrl, uploading: false } : img
            )
          );
        } catch {
          setImages((prev) =>
            prev.map((img) =>
              img.file === file ? { ...img, uploading: false, error: "Upload failed" } : img
            )
          );
        }
      })
    );
  }, [images, uploadImageToS3]);

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!title || !price || !category || !description || !meetupLocation) {
      toast.error("Please fill in all details");
      return;
    }
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }
    
    // We get token & user from useAuth
    // Assume user is globally available here. But wait, `useAuth` is already called at top!
    if (!user?.phone_number) {
      toast.error("You must configure your phone number in Settings before selling.");
      router.push("/profile/settings");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/v1/listings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          price,
          description,
          category_slug: category,
          meetup_location: meetupLocation,
          is_on_campus: meetupType === 'on-campus',
          condition: "GOOD",
          image_urls: images.filter(img => img.publicUrl).map(img => img.publicUrl)
        })
      });

      if (!res.ok) throw new Error("Failed to create listing");
      
      toast.success("Listing published successfully!");
      router.push("/profile/listings");
    } catch (err: any) {
      toast.error(err.message || "Failed to publish listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { label: "Science & Tech", value: "science" },
    { label: "Engineering", value: "engineering" },
    { label: "Textbooks", value: "textbooks" },
    { label: "Electronics", value: "electronics" },
    { label: "Apparel", value: "apparel" },
    { label: "Other", value: "other" },
  ];

  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      <Navbar />
      <main className="max-w-[42rem] mx-auto px-6 py-10">
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Step {step} of {totalSteps}</span>
            <span className="text-[13px] font-bold text-gray-900 uppercase tracking-widest">
              {step === 1 ? "Basics" : step === 2 ? "Pricing & Details" : "Photos & Location"}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gray-900 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        {/* Wizard Form */}
        <div className="bg-white border border-gray-200/80 rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative min-h-[500px] flex flex-col">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-[15px] duration-500 flex-1">
              <div className="mb-8 flex items-center gap-3.5">
                <div className="p-3 bg-[#f8f9fa] rounded-[0.85rem]"><Tag className="w-5 h-5 text-gray-500" /></div>
                <div>
                  <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-0.5">Let's start with the basics</h2>
                  <p className="text-[14.5px] text-gray-500 font-medium">What exactly are you selling to your fellow students?</p>
                </div>
              </div>

              <div className="space-y-7">
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. TI-30 Calculator, Almost New" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-[15px]" />
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Category</label>
                  <CustomSelect 
                    options={categoryOptions}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select a category..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-[15px] duration-500 flex-1">
              <div className="mb-8 flex items-center gap-3.5">
                <div className="p-3 bg-[#f8f9fa] rounded-[0.85rem]"><Info className="w-5 h-5 text-gray-500" /></div>
                <div>
                  <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-0.5">Pricing and Details</h2>
                  <p className="text-[14.5px] text-gray-500 font-medium">Give buyers the information they need.</p>
                </div>
              </div>

              <div className="space-y-7">
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Price (KES)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">KES</span>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1,500" className="w-full border border-gray-200 rounded-xl pl-14 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-[15px]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Description</label>
                  <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any details the buyer should know? E.g. Missing original box, barely used, comes with charger..." className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 resize-none placeholder:text-gray-400 font-medium text-[15px]"></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-[15px] duration-500 flex-1">
              <div className="mb-8 flex items-center gap-3.5">
                <div className="p-3 bg-[#f8f9fa] rounded-[0.85rem]"><Camera className="w-5 h-5 text-gray-500" /></div>
                <div>
                  <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-0.5">Photos & Meetup</h2>
                  <p className="text-[14.5px] text-gray-500 font-medium">Show it off and set a convenient campus meetup.</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">
                    Item Photos <span className="text-gray-400 font-normal">({images.length}/4)</span>
                  </label>

                  {/* Image grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                          {img.uploading && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                            </div>
                          )}
                          {img.error && (
                            <div className="absolute inset-0 bg-red-50/80 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-red-500 text-center px-1">Failed</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-900/70 hover:bg-gray-900 flex items-center justify-center transition-colors"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dropzone (hidden when 4 images) */}
                  {images.length < 4 && (
                    <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#f8f9fa] transition-colors cursor-pointer bg-[#f8f9fa]/50">
                      <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-900">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <p className="font-bold text-gray-900 mb-1">Click or drag images here</p>
                      <p className="text-[13px] text-gray-400 font-medium">Up to {4 - images.length} more photo{4 - images.length !== 1 ? 's' : ''}. Well-lit photos sell faster!</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFiles(e.target.files)}
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-3">Meetup Type</label>
                  <div className="flex bg-[#f8f9fa] border border-gray-200/80 rounded-[0.8rem] p-1.5 mb-5">
                    <button type="button" onClick={() => setMeetupType('on-campus')} className={`flex-1 py-2 text-[14px] font-bold rounded-lg transition-all ${meetupType === 'on-campus' ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>On-Campus</button>
                    <button type="button" onClick={() => setMeetupType('off-campus')} className={`flex-1 py-2 text-[14px] font-bold rounded-lg transition-all ${meetupType === 'off-campus' ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Off-Campus</button>
                  </div>

                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Detailed Meetup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="text" value={meetupLocation} onChange={(e) => setMeetupLocation(e.target.value)} placeholder={meetupType === 'on-campus' ? "e.g. Main library entrance, Block C lobby..." : "e.g. Ongata Rongai, near the mall..."} className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-[15px]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-8 mt-auto border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={handlePrev} className="px-6 py-3.5 rounded-xl font-bold flex items-center gap-1.5 text-gray-500 hover:bg-[#f8f9fa] hover:text-gray-900 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div> /* Spacer */
            )}

            {step < totalSteps ? (
              <button type="button" onClick={handleNext} className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-[0.85rem] font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-gray-900 hover:bg-black text-white px-10 py-3.5 rounded-[0.85rem] font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] disabled:opacity-50">
                {isSubmitting ? "Publishing..." : "Submit"}
              </button>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
