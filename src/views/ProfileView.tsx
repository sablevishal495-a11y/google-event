import React, { useState } from 'react';

interface ProfileViewProps {
  onOpenEmergencyVoucher: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenEmergencyVoucher }) => {
  const [language, setLanguage] = useState('English');
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [showCallAlert, setShowCallAlert] = useState<string | null>(null);

  const emergencyHelplines = [
    { title: 'Women Helpline (All India)', number: '1091', desc: '24/7 National Emergency Support' },
    { title: 'National Emergency Number', number: '112', desc: 'Police, Ambulance & Fire Service' },
    { title: 'Health & Medical Helpline', number: '104', desc: 'Reproductive & Mental Health Counseling' },
    { title: 'Delhi Metro Railway Police', number: '1511', desc: 'Assistance across DMRC Metro Stations' }
  ];

  const handleCall = (title: string, number: string) => {
    setShowCallAlert(`Dialing ${title} (${number})...`);
    setTimeout(() => setShowCallAlert(null), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-4 px-4 max-w-xl mx-auto gap-5">
      {/* Anonymous Profile Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#613b52]/15 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#934461] to-[#613b52] text-white flex items-center justify-center shadow-md shrink-0">
          <span className="material-symbols-outlined text-[28px]">person</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-bold text-[#1f1a20]">Dignity Access User</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#94f99a] text-[#004715] text-[10px] font-bold">
              Active
            </span>
          </div>
          <p className="text-[12px] text-[#534347] mt-0.5">
            Zero-tracking public health mode • No credentials stored
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-[#934461] font-semibold bg-[#ffd9e2] px-2 py-0.5 rounded-full">
              Community Contributor Level 1
            </span>
          </div>
        </div>
      </div>

      {showCallAlert && (
        <div className="p-3 bg-[#ffd8ec] border border-[#934461] rounded-xl text-[#301025] text-[12px] font-bold text-center animate-pulse">
          {showCallAlert}
        </div>
      )}

      {/* Emergency Fast Dial Helplines */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-[15px] font-bold text-[#1f1a20] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
              e911_emergency
            </span>
            Emergency Assistance Hotlines
          </h4>
          <span className="text-[11px] text-[#857277]">24/7 Toll Free</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {emergencyHelplines.map((line) => (
            <div
              key={line.number}
              className="p-3.5 rounded-xl bg-white border border-[#613b52]/10 shadow-sm flex items-center justify-between hover:border-[#934461]/40 transition-colors"
            >
              <div>
                <span className="text-[13px] font-bold text-[#1f1a20] block">
                  {line.title}
                </span>
                <span className="text-[11px] text-[#534347] block">{line.desc}</span>
                <span className="text-[14px] font-mono font-bold text-[#934461] mt-1 block">
                  {line.number}
                </span>
              </div>
              <button
                onClick={() => handleCall(line.title, line.number)}
                className="w-10 h-10 rounded-full bg-[#ffd8ec] text-[#934461] flex items-center justify-center hover:bg-[#934461] hover:text-white transition-colors shrink-0 shadow-sm"
                title={`Call ${line.number}`}
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-white p-5 rounded-2xl border border-[#613b52]/15 shadow-sm flex flex-col gap-4">
        <h4 className="text-[15px] font-bold text-[#1f1a20]">App Settings & Privacy</h4>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-[13px] font-semibold text-[#1f1a20] block">
              Anonymous Public Health Access
            </span>
            <span className="text-[11px] text-[#534347]">
              Prevents storing GPS tracks or search history on servers
            </span>
          </div>
          <button
            onClick={() => setAnonymousMode(!anonymousMode)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              anonymousMode ? 'bg-[#006e25]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                anonymousMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-gray-100">
          <div>
            <span className="text-[13px] font-semibold text-[#1f1a20] block">
              Interface Language
            </span>
            <span className="text-[11px] text-[#534347]">
              Language used for indoor instructions and alerts
            </span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-1.5 rounded-lg bg-[#efe5ed] border border-[#613b52]/10 text-[12px] font-semibold text-[#1f1a20] focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Bengali">বাংলা (Bengali)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Marathi">मराठी (Marathi)</option>
          </select>
        </div>
      </div>

      {/* About SHE-ACCESS Mission */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#fbf1f9] to-[#fff7fc] border border-[#613b52]/15 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#934461] text-[20px]">
            volunteer_activism
          </span>
          <h4 className="text-[14px] font-bold text-[#1f1a20]">
            About SHE-ACCESS Network
          </h4>
        </div>
        <p className="text-[12px] text-[#534347] leading-relaxed">
          SHE-ACCESS is an open public-health telemetry platform designed to ensure no woman or girl is left stranded in transit, campus, or public spaces without access to hygienic sanitary products.
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-[#613b52]/10 text-[11px] text-[#857277]">
          <span>Version 2.4.0 • Live Telemetry</span>
          <span>Open Public Infrastructure</span>
        </div>
      </div>
    </div>
  );
};
