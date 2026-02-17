import { useState } from "react";

export default function TabsDemo() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    {
      id: "account",
      label: "Account",
      content:
        "Make changes to your account here. Click save when you're done.",
    },
    {
      id: "password",
      label: "Password",
      content: "Change your password here. After saving, you'll be logged out.",
    },
  ];

  return (
    <div className="w-full max-w-[400px] space-y-4">
      {/* Tab List Container */}
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all cursor-pointer w-full
              ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "hover:bg-background/50 hover:text-foreground"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      {tabs.map(
        (tab) =>
          activeTab === tab.id && (
            <div
              key={tab.id}
              className="mt-2 ring-offset-background focus-visible:outline-none animate-in fade-in-50 duration-200"
            >
              <div className="rounded-[--radius] border border-border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">{tab.content}</p>
                <button className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:brightness-110 transition-all">
                  Save {tab.label}
                </button>
              </div>
            </div>
          ),
      )}
    </div>
  );
}
