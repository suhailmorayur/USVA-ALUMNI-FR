import React from 'react';

const CardPreview = ({ member, validity = 'Mar 2028', side = 'front', scale = 1, layout = 'portrait' }) => {
  if (!member) return null;

  // Sanad text builder
  const hasSanad = member.sand && member.sand.length > 0;
  let sanadText = '';
  if (hasSanad) {
    if (member.sand.includes('umari') && member.sand.includes('faizy')) {
      sanadText = 'Umari Faizy';
    } else if (member.sand.includes('umari')) {
      sanadText = 'Umari';
    } else if (member.sand.includes('faizy')) {
      sanadText = 'Faizy';
    }
  }

  // ------------------ PORTRAIT LAYOUT RENDER ------------------
  if (layout === 'portrait') {
    if (side === 'front') {
      return (
        <div
          className="relative w-full aspect-[638/1004] bg-slate-100 overflow-hidden shadow-lg border border-slate-200 rounded-lg select-none"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            containerType: 'inline-size'
          }}
        >
          {/* Background Design Image */}
          <img
            src="/assets/card-front-portrait.png"
            alt="Card Front Portrait"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Mask validity text area ONLY (solid #08aed0) */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: '60.81%',
              top: '13.65%',
              width: '34.48%',
              height: '6.18%',
              background: '#08aed0'
            }}
          />

          {/* Student Photo Rounded Container Box (No white border, 28px rounded corners on all 4 sides) */}
          <div
            className="absolute overflow-hidden bg-slate-200"
            style={{
              left: '14.57%',   // 93 / 638
              top: '20.91%',    // 210 / 1004
              width: '32.75%',   // 209 / 638
              height: '27.29%',  // 274 / 1004
              borderRadius: '28px'
            }}
          >
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={member.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-400 text-[10px]">
                No Photo
              </div>
            )}
          </div>

          {/* Student Name (Reference position and font-size 40px) */}
          <div
            className="absolute text-white font-bold uppercase truncate pointer-events-none"
            style={{
              left: '15.05%',   // 96 / 638
              top: '54.38%',    // 546 / 1004
              width: '75%',
              fontSize: '6.27cqw', // 40px proportional
              textShadow: '0 1px 2px rgba(0,0,0,0.15)'
            }}
          >
            {member.fullName}
          </div>

          {/* Student Sanad (Reference position and font-size 36px) */}
          {hasSanad && (
            <div
              className="absolute font-bold uppercase truncate pointer-events-none"
              style={{
                left: '15.05%',   // 96 / 638
                top: '58.66%',    // 589 / 1004
                width: '75%',
                color: '#e2eb12',
                fontSize: '5.64cqw', // 36px proportional
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {sanadText}
            </div>
          )}

          {/* Details Block (Black text - Place, Ad. No, Phone - Reference positions and font-size 25px) */}
          <div
            className="absolute flex flex-col text-black font-bold"
            style={{
              left: '24.29%',   // 155 / 638
              top: '70.12%',    // 704 / 1004
              width: '60%',
              gap: '1.0cqw'     // 30-32px spacing gap
            }}
          >

            {/* Place Row */}
            <div className="flex items-center" style={{ fontSize: '3.91cqw', height: '4.8`cqw' }}>
              <span className="text-slate-900" style={{ width: '17cqw' }}>Place</span>
              <span className="text-slate-900" style={{ width: '5cqw' }}>:</span>
              <span className="truncate flex-1 font-bold text-black">{member.place}</span>
            </div>

            {/* Admission Number Row */}
            <div className="flex items-center" style={{ fontSize: '3.91cqw', height: '4.8cqw' }}>
              <span className="text-slate-900" style={{ width: '17cqw' }}>Ad. No</span>
              <span className="text-slate-900" style={{ width: '5cqw' }}>:</span>
              <span className="truncate flex-1 font-bold text-black">{member.admissionNumber}</span>
            </div>

            {/* Phone Row */}
            <div className="flex items-center" style={{ fontSize: '3.91cqw', height: '4.8cqw' }}>
              <span className="text-slate-900" style={{ width: '17cqw' }}>Phone</span>
              <span className="text-slate-900" style={{ width: '5cqw' }}>:</span>
              <span className="truncate flex-1 font-bold text-black">{member.phone}</span>
            </div>
          </div>
        </div>
      );
    }

    // Render BACK side
    return (
      <div
        className="relative w-full aspect-[638/1004] bg-slate-100 overflow-hidden shadow-lg border border-slate-200 rounded-lg select-none"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <img
          src="/assets/card-back-portrait.png"
          alt="Card Back Portrait"
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    );
  }

  // ------------------ LANDSCAPE LAYOUT RENDER (Admin Print) ------------------
  if (side === 'front') {
    return (
      <div
        className="relative w-full aspect-[1004/638] bg-slate-100 overflow-hidden shadow-lg border border-slate-200 rounded-lg select-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          containerType: 'inline-size'
        }}
      >
        {/* Background Design Image */}
        <img
          src="/assets/card-front.png"
          alt="Card Front Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Student Cropped Photo Rounded Box (No border, 28px corners) */}
        <div
          className="absolute overflow-hidden bg-slate-200"
          style={{
            left: '9.96%',     // 100 / 1004
            top: '12.54%',     // 80 / 638
            width: '23.9%',      // 240 / 1004
            height: '48.59%',    // 310 / 638
            borderRadius: '28px'
          }}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-400 text-xs">
              No Photo
            </div>
          )}
        </div>

        {/* Student Name */}
        <div
          className="absolute text-white font-bold uppercase truncate"
          style={{
            left: '400px',
            top: '120px',
            width: '480px',
            fontSize: '34px',
            fontFamily: 'Arial, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          {member.fullName}
        </div>

        {/* Student Sanad (no space below name) */}
        {hasSanad && (
          <div
            className="absolute font-bold uppercase truncate"
            style={{
              left: '400px',
              top: '154px',
              width: '480px',
              color: '#e2eb12',
              fontSize: '34px',
              fontFamily: 'Arial, sans-serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)'
            }}
          >
            {sanadText}
          </div>
        )}

        {/* Details Block (Bold Black text - Place, Ad. No, Phone only - 50px gap below Sanad) */}
        <div 
          className="absolute flex flex-col font-bold text-black"
          style={{
            left: '400px',
            top: '238px',
            width: '450px',
            gap: '14px',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {/* Place Row */}
          <div className="flex items-center" style={{ fontSize: '18px', height: '24px' }}>
            <span style={{ width: '90px' }}>Place</span>
            <span style={{ width: '20px' }}>:</span>
            <span className="truncate flex-1 font-bold text-black">{member.place}</span>
          </div>

          {/* Admission Number Row */}
          <div className="flex items-center" style={{ fontSize: '18px', height: '24px' }}>
            <span style={{ width: '90px' }}>Ad. No</span>
            <span style={{ width: '20px' }}>:</span>
            <span className="truncate flex-1 font-bold text-black">{member.admissionNumber}</span>
          </div>

          {/* Phone Row */}
          <div className="flex items-center" style={{ fontSize: '18px', height: '24px' }}>
            <span style={{ width: '90px' }}>Phone</span>
            <span style={{ width: '20px' }}>:</span>
            <span className="truncate flex-1 font-bold text-black">{member.phone}</span>
          </div>
        </div>
      </div>
    );
  }

  // Render BACK side
  return (
    <div
      className="relative w-full aspect-[1004/638] bg-slate-100 overflow-hidden shadow-lg border border-slate-200 rounded-lg select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <img
        src="/assets/card-back.jpg"
        alt="Card Back Background"
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
};

export default CardPreview;
