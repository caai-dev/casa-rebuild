import MembersView from './components/MembersView';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#f9fafb] text-[#0a1b33] selection:bg-[#b8935a]/25 selection:text-[#0a1b33]">
      {/* Standalone LMS Portal container */}
      <main className="relative flex flex-col w-full z-10 py-10">
        <MembersView />
      </main>
    </div>
  );
}
