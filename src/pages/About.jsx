import React from 'react';
import { Award, BookOpen, GraduationCap, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <Award className="w-12 h-12 text-teal-700 mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">About USVA</h1>
          <p className="text-slate-500 text-lg">Umariyya Students Venerable Association</p>
        </div>

        {/* Association Intro Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-slate-800">Our Alma Mater</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The <strong>Umarali Shihab Thangal Islamic Academy, Arimbra</strong> is a premier Islamic educational institution in Malappuram district, Kerala. Established to provide advanced theological training coupled with contemporary studies, the academy has nurtured thousands of scholars over the past decades.
          </p>
          <p className="text-slate-600 leading-relaxed">
            <strong>USVA</strong> is the official alumni union of this academy. It was founded to maintain the bond of brotherhood among alumni, support the academy's progress, and engage in charitable, educational, and spiritual endeavors.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <Users className="w-8 h-8 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-800">Fraternal Bond</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We connect scholars who graduated over the years, facilitating professional networking, mentoring, and support.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <BookOpen className="w-8 h-8 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-800">Academic Integrity</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We preserve scholastic traditions, supporting seminars, Islamic jurisprudential panels, and publication projects.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <Award className="w-8 h-8 text-teal-600" />
            <h3 className="text-lg font-bold text-slate-800">Leadership</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We cultivate leadership among the younger batch of graduates, encouraging active community involvement.
            </p>
          </div>
        </div>

        {/* Association Leadership Mock Block */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Association Leadership</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-lg">Fahiz Umari Faizy</h4>
              <p className="text-teal-700 text-sm font-semibold">President, USVA</p>
              <p className="text-slate-400 text-xs mt-1">Official Representative & Executive Committee Head</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-lg">Ubaidulla Umari Faizy</h4>
              <p className="text-teal-700 text-sm font-semibold">General Secretary, USVA</p>
              <p className="text-slate-400 text-xs mt-1">Administrative Secretary & Correspondence Supervisor</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
