import { CheckCircle2, LogIn, LogOut, UserCheck, Users } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import type { ProfileId } from '../types/study';

export function AuthGate() {
  const {
    user,
    authReady,
    authError,
    signingIn,
    membershipChecked,
    claimingProfile,
    profiles,
    signInWithGoogle,
    logout,
    claimProfile,
  } = useStudy();

  if (!authReady || (user && !membershipChecked)) {
    return (
      <div className="min-h-screen bg-[#060B14] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0B1220] border border-slate-800 rounded-xl p-8 text-center space-y-4">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-300">Connecting to GATE 2027 ECE study room...</p>
        </div>
      </div>
    );
  }

  // Step 1: Not signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060B14] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#0B1220] border border-slate-800/90 rounded-2xl p-8 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium text-cyan-400">
              Private Duo Study Tracker · GATE 2027 ECE
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100 [text-wrap:balance]">
              Tharun &amp; Sreevishnu Study Workspace
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sign in with your Google account to sync syllabus completion, daily tasks, and study timer sessions in real time.
            </p>
          </div>

          <div className="border-t border-slate-800/80 pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-[#0F172A]/80 border border-slate-800/80">
                <p className="font-medium text-slate-100">Tharun</p>
                <p className="text-xs text-slate-400 mt-1">Student 1 · GATE ECE</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0F172A]/80 border border-slate-800/80">
                <p className="font-medium text-slate-100">Sreevishnu</p>
                <p className="text-xs text-slate-400 mt-1">Student 2 · GATE ECE</p>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-xs text-red-300">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{signingIn ? 'Opening Google Sign-In...' : 'Sign in with Google'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Signed in, needs to claim either Tharun or Sreevishnu
  const tharunClaimed = Boolean(profiles.tharun);
  const sreeClaimed = Boolean(profiles.sreevishnu);
  const bothClaimedByOthers = tharunClaimed && sreeClaimed;

  const renderSlotCard = (profileId: ProfileId, label: string, sublabel: string) => {
    const existing = profiles[profileId];
    const claimed = Boolean(existing);

    return (
      <div
        key={profileId}
        className="p-5 rounded-xl bg-[#0F172A]/80 border border-slate-800 flex flex-col justify-between gap-4"
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">{label}</h2>
            {claimed ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Linked
              </span>
            ) : (
              <span className="text-xs text-cyan-400">Available</span>
            )}
          </div>
          <p className="text-xs text-slate-400">{sublabel}</p>
        </div>

        {claimed ? (
          <div className="text-xs text-slate-500 py-2">
            Already linked to a Google account
          </div>
        ) : (
          <button
            type="button"
            disabled={claimingProfile}
            onClick={() => claimProfile(profileId)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>{claimingProfile ? 'Linking...' : `Continue as ${label}`}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[#0B1220] border border-slate-800/90 rounded-2xl p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs text-cyan-400">
              <Users className="w-3.5 h-3.5" />
              <span>Select Your Student Profile</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-100">
              Join the GATE 2027 ECE Duo Room
            </h1>
            <p className="text-xs text-slate-400">
              Signed in as {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Switch Account
          </button>
        </div>

        {authError && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-xs text-red-300">
            {authError}
          </div>
        )}

        {bothClaimedByOthers ? (
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <p className="text-sm text-slate-200 font-medium">
              Both student profiles are already linked.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              This private study room is restricted to Tharun and Sreevishnu. Please sign in with the Google account linked to your profile.
            </p>
            <button
              type="button"
              onClick={async () => {
                await logout();
                await signInWithGoogle();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Another Google Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSlotCard('tharun', 'Tharun', 'Student 1 · Independent syllabus & daily tracker')}
            {renderSlotCard('sreevishnu', 'Sreevishnu', 'Student 2 · Independent syllabus & daily tracker')}
          </div>
        )}
      </div>
    </div>
  );
}
