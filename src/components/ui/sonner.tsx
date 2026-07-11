"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'rgba(31, 41, 55, 0.95)',
          border: '1px solid rgba(33, 167, 255, 0.3)',
          color: '#EAFBFF',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
