import React from 'react';

export const ModernInput = ({ label, value, onChange, placeholder, type = "text", icon: Icon, rightElement }) => (
  <div className="flex flex-col gap-2 w-full text-left">
    {label && <label className="font-bold text-[11px] uppercase tracking-widest text-gray-500 ml-1">{label}</label>}
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#006D5B] transition-colors" />}
      <input 
        type={type} value={value} onChange={onChange} placeholder={placeholder} 
        className={`w-full ${Icon ? 'pl-12' : 'px-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-4 bg-gray-50/80 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#006D5B] focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-medium text-[15px] placeholder:text-gray-400`} 
      />
      {rightElement && <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{rightElement}</div>}
    </div>
  </div>
);
