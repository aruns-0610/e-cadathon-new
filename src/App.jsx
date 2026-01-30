import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Header from './components/Header'
import WelcomeSection from './components/WelcomeSection'
import EventsSection from './components/EventsSection'
import Instructions from './components/Instructions'
import Quiz from './components/Quiz'
import TestCompleted from './components/TestCompleted'
import Disqualified from './components/Disqualified'
import AuthModal from './components/AuthModal'
// 
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false); // Added quizCompleted state
  const [testStatus, setTestStatus] = useState(null); // null | 'eligible' | 'submitted' | 'disqualified'

  // Check for existing session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userName = session.user.user_metadata?.name || session.user.email.split('@')[0];
        setUser({
          name: userName,
          email: session.user.email,
          id: session.user.id
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userName = session.user.user_metadata?.name || session.user.email.split('@')[0];
        setUser({
          name: userName,
          email: session.user.email,
          id: session.user.id
        });
        setIsAuthModalOpen(false); // Close modal on successful auth
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check test results when user logs in
  useEffect(() => {
    const checkTestStatus = async () => {
      if (!user?.email) {
        setTestStatus(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found - user hasn't taken test
            setTestStatus('eligible');
          } else {
            console.error('Error checking test status:', error);
            setTestStatus('eligible'); // Default to eligible on error
          }
        } else if (data) {
          // User has a record
          if (data.is_disqualified) {
            setTestStatus('disqualified');
          } else if (data.is_submitted) {
            setTestStatus('submitted');
          } else {
            setTestStatus('eligible');
          }
        }
      } catch (err) {
        console.error('Test status check error:', err);
        setTestStatus('eligible');
      }
    };

    checkTestStatus();
  }, [user]);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogoutClick = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setQuizStarted(false);
    setQuizCompleted(false); // Reset quizCompleted on logout
  };

  const handleLoginSubmit = (userData) => {
    setUser(userData);
  };

  const handleStartTest = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    // Enter Full Screen if possible (optional)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Error attempting to enable fullscreen:", err);
      });
    }
    setQuizStarted(true);
    setQuizCompleted(false); // Reset quizCompleted when starting a new quiz
  };

  const handleQuizComplete = (isDisqualified = false) => { // Added handleQuizComplete function
    setQuizStarted(false);
    if (isDisqualified === true) {
      setTestStatus('disqualified');
      setQuizCompleted(false); // Ensure Disqualified component renders
    } else {
      setQuizCompleted(true);
      setTestStatus('submitted');
    }
  };

  return (
    <div className="app-container">
      {!quizStarted && (
        <Header
          user={user}
          onLoginClick={handleLoginClick}
          onLogoutClick={handleLogoutClick}
        />
      )}


      <main className="main-content">
        {quizStarted ? (
          <Quiz onQuizComplete={handleQuizComplete} user={user} />
        ) : (
          <>
            <WelcomeSection />
            <EventsSection />
            {quizCompleted ? (
              <TestCompleted />
            ) : testStatus === 'disqualified' ? (
              <Disqualified />
            ) : testStatus === 'submitted' ? (
              <TestCompleted />
            ) : (
              <Instructions
                user={user}
                onStartTest={handleStartTest}
              />
            )}
          </>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLoginSubmit}
      />
    </div>
  )
}

export default App
