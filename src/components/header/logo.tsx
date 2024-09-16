import * as React from 'react';

export const Logo = React.forwardRef<SVGSVGElement, React.HTMLAttributes<SVGSVGElement>>((props, ref) => {
  return (
    <svg {...props} ref={ref} width="218" height="218" viewBox="0 0 218 218" fill="none">
      <path d="M140.621 51V115.722" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M112.57 67.1821L168.619 99.5431" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M112.57 99.5431L168.619 67.1821" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M88.8332 141.611C88.8332 138.178 87.4694 134.886 85.0418 132.458C82.6143 130.031 79.3218 128.667 75.8888 128.667H62.9444C59.5113 128.667 56.2189 130.031 53.7913 132.458C51.3638 134.886 50 138.178 50 141.611V154.556C50 157.989 51.3638 161.281 53.7913 163.709C56.2189 166.136 59.5113 167.5 62.9444 167.5H75.8888C79.3218 167.5 82.6143 166.136 85.0418 163.709C87.4694 161.281 88.8332 157.989 88.8332 154.556V141.611Z"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

Logo.displayName = 'Logo';
