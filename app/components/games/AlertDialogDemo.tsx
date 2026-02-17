import { useState } from "react";

export default function AlertDialogDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium hover:brightness-90 transition-all cursor-pointer"
      >
        Delete Account
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog Content */}
          <div className="relative z-50 grid w-full max-w-lg gap-4 border border-border bg-card p-6 shadow-lg rounded-[--radius] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold">
                Are you absolutely sure?
              </h2>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Deleted!");
                  setIsOpen(false);
                }}
                className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:brightness-90 transition-colors cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
