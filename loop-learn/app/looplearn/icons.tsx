import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const stroke = (paths: React.ReactNode, extra?: IconProps) => (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" {...extra} {...props}>
    {paths}
  </svg>
);

export const Icon = {
  home:    stroke(<><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V11z"/></>),
  inbox:   stroke(<><path d="M3 13l3-8h12l3 8M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M3 13h5l1 3h6l1-3h5"/></>),
  calendar:stroke(<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>),
  chat:    stroke(<><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z"/></>),
  user:    stroke(<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>),
  plus:    stroke(<><path d="M12 5v14M5 12h14"/></>, { strokeWidth: '2' }),
  check:   stroke(<><path d="M5 13l4 4L19 7"/></>, { strokeWidth: '2.4' }),
  x:       stroke(<><path d="M6 6l12 12M18 6L6 18"/></>, { strokeWidth: '2.2' }),
  edit:    stroke(<><path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4"/></>),
  arrow:   stroke(<><path d="M5 12h14M13 5l7 7-7 7"/></>, { strokeWidth: '2' }),
  back:    stroke(<><path d="M19 12H5M12 5l-7 7 7 7"/></>, { strokeWidth: '2' }),
  bell:    stroke(<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0"/></>),
  send:    stroke(<><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></>),
  sparkle: stroke(<><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></>),
  book:    stroke(<><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5zM8 7h8M8 11h8"/></>),
  signout: stroke(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></>),
};
