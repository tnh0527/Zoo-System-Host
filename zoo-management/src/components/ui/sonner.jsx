import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={{
        "--normal-bg": "white",
        "--normal-text": "black",
        "--normal-border": "#e5e7eb",
      }}
      {...props}
    />
  );
};

export { Toaster };
