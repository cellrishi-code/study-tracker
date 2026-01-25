import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Flame, Clock, Plus, X, Play, Pause, RotateCcw, ChevronDown, ChevronRight, Calculator, Code, Zap, LogOut, Globe } from 'lucide-react';

const EngineeringStudyTracker = () => {
  const [screen, setScreen] = useState('auth');
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('English');
  const [department, setDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dailyGoal, setDailyGoal] = useState(4);
  const [studiedToday, setStudiedToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentSemester, setCurrentSemester] = useState(1);
  const [semesters, setSemesters] = useState({});
  const [topics, setTopics] = useState([]);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', progress: 0 });
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroWorkDuration, setPomodoroWorkDuration] = useState(25);
  const [pomodoroBreakDuration, setPomodoroBreakDuration] = useState(5);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddFormula, setShowAddFormula] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', credits: 3 });
  const [newFormula, setNewFormula] = useState({ subject: '', title: '', formula: '', image: null });
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
    'Korean', 'Hindi', 'Arabic', 'Portuguese', 'Russian', 'Italian',
    'Turkish', 'Vietnamese', 'Thai', 'Indonesian', 'Dutch', 'Polish'
  ];

  const themes = {
    CSE: { 
      primary: '#3b82f6', 
      secondary: '#1e40af', 
      gradient: 'from-blue-600 to-indigo-700',
      name: 'Computer Science Engineering'
    },
    ECE: { 
      primary: '#10b981', 
      secondary: '#047857', 
      gradient: 'from-green-600 to-teal-700',
      name: 'Electronics & Communication'
    },
    MECH: { 
      primary: '#f59e0b', 
      secondary: '#d97706', 
      gradient: 'from-amber-600 to-orange-700',
      name: 'Mechanical Engineering'
    },
    CIVIL: { 
      primary: '#8b5cf6', 
      secondary: '#6d28d9', 
      gradient: 'from-purple-600 to-violet-700',
      name: 'Civil Engineering'
    },
    EEE: { 
      primary: '#ef4444', 
      secondary: '#dc2626', 
      gradient: 'from-red-600 to-rose-700',
      name: 'Electrical Engineering'
    }
  };

  const theme = department ? themes[department] : null;

  useEffect(() => {
    let interval;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && isRunning) {
      setIsRunning(false);
      if (isWorkSession) {
        alert('Work session complete! Time for a break.');
        setPomodoroTime(pomodoroBreakDuration * 60);
        setIsWorkSession(false);
      } else {
        alert('Break complete! Ready for another work session.');
        setPomodoroTime(pomodoroWorkDuration * 60);
        setIsWorkSession(true);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, isWorkSession, pomodoroWorkDuration, pomodoroBreakDuration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAuth = () => {
    // Validate fields
    if (authMode === 'signup') {
      if (!formData.name || !formData.email || !formData.password) {
        alert('Please fill all fields');
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        alert('Please fill all fields');
        return;
      }
    }
    
    // Set user and move to language screen
    const userName = formData.name || formData.email.split('@')[0];
    setUser({ email: formData.email, name: userName });
    setScreen('language');
  };

  const handleLanguageSelect = () => {
    setScreen('department');
  };

  const handleDepartmentSelect = (dept) => {
    setDepartment(dept);
    setScreen('app');
  };

  const handleLogout = () => {
    setUser(null);
    setDepartment(null);
    setLanguage('English');
    setScreen('auth');
    setFormData({ email: '', password: '', name: '' });
  };

  const addStudyHour = () => {
    if (studiedToday < dailyGoal) {
      setStudiedToday(prev => prev + 0.5);
    }
  };

  const addSubjectToSemester = () => {
    if (newSubject.name && newSubject.credits) {
      const semesterKey = `sem${currentSemester}`;
      setSemesters(prev => ({
        ...prev,
        [semesterKey]: {
          ...prev[semesterKey],
          subjects: [...(prev[semesterKey]?.subjects || []), { 
            id: Date.now(), 
            name: newSubject.name, 
            credits: parseInt(newSubject.credits),
            formulas: []
          }]
        }
      }));
      setNewSubject({ name: '', credits: 3 });
      setShowAddSubject(false);
    }
  };

  const addFormula = () => {
    if (newFormula.subject && newFormula.title && (newFormula.formula || newFormula.image)) {
      const semesterKey = `sem${currentSemester}`;
      setSemesters(prev => {
        const subjects = prev[semesterKey]?.subjects || [];
        const updatedSubjects = subjects.map(sub => 
          sub.name === newFormula.subject 
            ? { ...sub, formulas: [...(sub.formulas || []), { 
                id: Date.now(), 
                title: newFormula.title, 
                formula: newFormula.formula,
                image: newFormula.image 
              }] }
            : sub
        );
        return {
          ...prev,
          [semesterKey]: { ...prev[semesterKey], subjects: updatedSubjects }
        };
      });
      setNewFormula({ subject: '', title: '', formula: '', image: null });
      setShowAddFormula(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFormula({...newFormula, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const addTopic = () => {
    if (newTopic.name) {
      setTopics(prev => [...prev, { 
        id: Date.now(), 
        name: newTopic.name, 
        progress: parseInt(newTopic.progress) || 0 
      }]);
      setNewTopic({ name: '', progress: 0 });
      setShowAddTopic(false);
    }
  };

  const updateTopicProgress = (id, newProgress) => {
    setTopics(prev => prev.map(topic => 
      topic.id === id ? { ...topic, progress: Math.min(100, Math.max(0, newProgress)) } : topic
    ));
  };

  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(topic => topic.id !== id));
  };

  const currentSemesterData = semesters[`sem${currentSemester}`] || { subjects: [] };

  if (screen === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-4 shadow-2xl">
              <Code size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              EngineTrack
            </h1>
            <p className="text-slate-400 mt-2">Your Engineering Study Companion</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  authMode === 'signin' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  authMode === 'signup' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <button
                onClick={handleAuth}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'language') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto pt-12">
          <div className="text-center mb-8">
            <Globe size={64} className="mx-auto mb-4 text-blue-400" />
            <h1 className="text-4xl font-bold mb-2">Choose Your Language</h1>
            <p className="text-slate-400">Select your preferred language</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  language === lang
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 scale-105'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleLanguageSelect}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-xl font-semibold text-lg hover:opacity-90"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'department') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Code size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Choose Your Department</h1>
            <p className="text-slate-400">Select your engineering field</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(themes).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleDepartmentSelect(key)}
                className={`bg-gradient-to-r ${value.gradient} rounded-2xl p-8 hover:scale-105 transform transition-all duration-300 shadow-2xl`}
              >
                <div className="text-white mb-4 flex justify-center">
                  {key === 'CSE' && <Code size={48} />}
                  {key === 'ECE' && <Zap size={48} />}
                  {key === 'MECH' && <Target size={48} />}
                  {key === 'CIVIL' && <Calculator size={48} />}
                  {key === 'EEE' && <Flame size={48} />}
                </div>
                <h2 className="text-2xl font-bold mb-2">{value.name}</h2>
                <p className="text-sm opacity-90">Tap to continue</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-24">
      <div className="max-w-7xl mx-auto">
        <div className={`bg-gradient-to-r ${theme.gradient} rounded-b-3xl p-6 mb-6 shadow-2xl`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {department === 'CSE' && <Code size={24} />}
                {department === 'ECE' && <Zap size={24} />}
                {department === 'MECH' && <Target size={24} />}
                {department === 'CIVIL' && <Calculator size={24} />}
                {department === 'EEE' && <Flame size={24} />}
              </div>
              <div>
                <div className="text-sm opacity-80">Welcome, {user?.name}</div>
                <div className="font-bold text-sm">{theme.name}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white border border-white/30 hover:bg-white/30 flex items-center gap-2 text-sm"
            >
              <LogOut size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} />
                <span className="text-xs opacity-90">Goal</span>
              </div>
              <div className="text-xl font-bold">{studiedToday}/{dailyGoal}h</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all"
                  style={{ width: `${(studiedToday/dailyGoal) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={18} />
                <span className="text-xs opacity-90">Streak</span>
              </div>
              <div className="text-xl font-bold">{streak} days</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} />
                <span className="text-xs opacity-90">{isWorkSession ? 'Work' : 'Break'}</span>
              </div>
              <div className="text-xl font-bold">{formatTime(pomodoroTime)}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setIsRunning(!isRunning)} className="bg-white/20 hover:bg-white/30 rounded-lg p-1">
                  {isRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button onClick={() => { 
                  setPomodoroTime(pomodoroWorkDuration * 60); 
                  setIsWorkSession(true);
                  setIsRunning(false); 
                }} className="bg-white/20 hover:bg-white/30 rounded-lg p-1">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4">
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <button 
                  onClick={addStudyHour}
                  style={{ backgroundColor: theme.primary }}
                  className="w-full py-3 rounded-xl font-semibold hover:opacity-90 mb-3"
                >
                  + Add 30 min Study Time
                </button>
                <button 
                  onClick={() => setStreak(prev => prev + 1)}
                  className="w-full py-3 bg-slate-700 rounded-xl font-semibold hover:bg-slate-600"
                >
                  Mark Today Complete
                </button>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                <label className="block mb-4">
                  <span className="text-sm opacity-80">Daily Goal (hours)</span>
                  <input 
                    type="number" 
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full mt-1 bg-slate-700 rounded-xl px-4 py-3 text-white"
                    min="1"
                    max="24"
                  />
                </label>
                
                <label className="block mb-4">
                  <span className="text-sm opacity-80">Pomodoro Work (min)</span>
                  <input 
                    type="number" 
                    value={pomodoroWorkDuration}
                    onChange={(e) => {
                      const newValue = Math.max(1, parseInt(e.target.value) || 25);
                      setPomodoroWorkDuration(newValue);
                      if (isWorkSession && !isRunning) {
                        setPomodoroTime(newValue * 60);
                      }
                    }}
                    className="w-full mt-1 bg-slate-700 rounded-xl px-4 py-3 text-white"
                    min="1"
                    max="120"
                  />
                </label>

                <label className="block mb-4">
                  <span className="text-sm opacity-80">Pomodoro Break (min)</span>
                  <input 
                    type="number" 
                    value={pomodoroBreakDuration}
                    onChange={(e) => {
                      const newValue = Math.max(1, parseInt(e.target.value) || 5);
                      setPomodoroBreakDuration(newValue);
                      if (!isWorkSession && !isRunning) {
                        setPomodoroTime(newValue * 60);
                      }
                    }}
                    className="w-full mt-1 bg-slate-700 rounded-xl px-4 py-3 text-white"
                    min="1"
                    max="60"
                  />
                </label>
                
                <label className="block">
                  <span className="text-sm opacity-80">Current Semester</span>
                  <select 
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(parseInt(e.target.value))}
                    className="w-full mt-1 bg-slate-700 rounded-xl px-4 py-3 text-white"
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="bg-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Topics</h2>
                <button 
                  onClick={() => setShowAddTopic(true)}
                  style={{ backgroundColor: theme.primary }}
                  className="px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Plus size={20} />
                </button>
              </div>

              {showAddTopic && (
                <div className="bg-slate-700 rounded-xl p-4 mb-4">
                  <input 
                    type="text"
                    placeholder="Topic Name"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({...newTopic, name: e.target.value})}
                    className="w-full bg-slate-600 rounded-xl px-4 py-3 mb-3 text-white"
                  />
                  <input 
                    type="number"
                    placeholder="Progress (0-100)"
                    value={newTopic.progress}
                    onChange={(e) => setNewTopic({...newTopic, progress: e.target.value})}
                    className="w-full bg-slate-600 rounded-xl px-4 py-3 mb-3 text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={addTopic} style={{ backgroundColor: theme.primary }} className="px-4 py-2 rounded-xl flex-1">Add</button>
                    <button onClick={() => setShowAddTopic(false)} className="px-4 py-2 bg-slate-600 rounded-xl flex-1">Cancel</button>
                  </div>
                </div>
              )}

              {topics.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Add your first topic!</p>
                </div>
              ) : (
                topics.map(topic => (
                  <div key={topic.id} className="mb-4 bg-slate-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">{topic.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="opacity-80">{topic.progress}%</span>
                        <button 
                          onClick={() => deleteTopic(topic.id)}
                          className="text-red-400"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3 mb-3">
                      <div 
                        style={{ width: `${topic.progress}%`, backgroundColor: theme.primary }}
                        className="h-3 rounded-full transition-all"
                      ></div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateTopicProgress(topic.id, topic.progress - 5)}
                        className="bg-slate-600 px-3 py-1 rounded-lg text-sm"
                      >
                        -5%
                      </button>
                      <button 
                        onClick={() => updateTopicProgress(topic.id, topic.progress + 5)}
                        style={{ backgroundColor: theme.primary }}
                        className="px-3 py-1 rounded-lg text-sm"
                      >
                        +5%
                      </button>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={topic.progress}
                        onChange={(e) => updateTopicProgress(topic.id, parseInt(e.target.value))}
                        className="flex-1"
                        style={{ accentColor: theme.primary }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'semesters' && (
            <div className="bg-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Semester {currentSemester}</h2>
                <button 
                  onClick={() => setShowAddSubject(true)}
                  style={{ backgroundColor: theme.primary }}
                  className="px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Plus size={20} />
                </button>
              </div>

              {showAddSubject && (
                <div className="bg-slate-700 rounded-xl p-4 mb-4">
                  <input 
                    type="text"
                    placeholder="Subject Name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    className="w-full bg-slate-600 rounded-xl px-4 py-3 mb-3 text-white"
                  />
                  <input 
                    type="number"
                    placeholder="Credits"
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject({...newSubject, credits: e.target.value})}
                    className="w-full bg-slate-600 rounded-xl px-4 py-3 mb-3 text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={addSubjectToSemester} style={{ backgroundColor: theme.primary }} className="px-4 py-2 rounded-xl flex-1">Add</button>
                    <button onClick={() => setShowAddSubject(false)} className="px-4 py-2 bg-slate-600 rounded-xl flex-1">Cancel</button>
                  </div>
                </div>
              )}

              {currentSemesterData.subjects.map(subject => (
                <div key={subject.id} className="bg-slate-700 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{subject.name}</span>
                      <span className="ml-2 text-sm opacity-70">{subject.credits} cr</span>
                    </div>
                    <div style={{ color: theme.primary }} className="font-bold text-sm">{subject.credits * 20}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'formulas' && (
            <div className="bg-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calculator size={24} />
                  Formulas
                </h2>
                <button 
                  onClick={() => setShowAddFormula(true)}
                  style={{ backgroundColor: theme.primary }}
                  className="px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Plus size={20} />
                </button>
              </div>

              {showAddFormula && (
                <div className="bg-slate-700 rounded-xl p-4 mb-4">
                  <select 
                    value={newFormula.subject}
                    onChange={(e) => setNewFormula({...newFormula, subject: e.target.value})}
                    className="w-full bg-slate-600 rounded-xl px-4 py-3 mb-3 text-white"
                  >
                    <option value="">Select Subject</option>
                    {currentSemesterData.subjects.map(sub => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                  <input 
                    type="text"
                    placeholder="Formula Title"
                    value={newFormula.title}
                    onChange={(e) => setNewFormula({...newFormula, title: e.target.value})}
                    className="w-full bg-slate-600 rounded-xl px-4 py-3 mb-3 text-white"
                  />
                  <textarea 
                    placeholder="Formula"
                    value={newFormula.formula}
                    onChange={(e) => setNewFormula({...newFormula, formula: e.target.value})}
                    className="w-full bg-slate-600 rounded-xl px-4 py-3 mb-3 h-24 text-white"
                  />
                  <div className="mb-3">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full bg-slate-600 rounded-xl px-4 py-3 text-sm text-white"
                    />
                    {newFormula.image && (
                      <div className="mt-3 relative">
                        <img 
                          src={newFormula.image} 
                          alt="Preview" 
                          className="max-w-full h-auto rounded-xl"
                        />
                        <button 
                          onClick={() => setNewFormula({...newFormula, image: null})}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addFormula} style={{ backgroundColor: theme.primary }} className="px-4 py-2 rounded-xl flex-1">Add</button>
                    <button onClick={() => {
                      setShowAddFormula(false);
                      setNewFormula({ subject: '', title: '', formula: '', image: null });
                    }} className="px-4 py-2 bg-slate-600 rounded-xl flex-1">Cancel</button>
                  </div>
                </div>
              )}

              {currentSemesterData.subjects.map(subject => (
                subject.formulas && subject.formulas.length > 0 && (
                  <div key={subject.id} className="mb-4">
                    <button 
                      onClick={() => setExpandedSemester(expandedSemester === subject.id ? null : subject.id)}
                      className="w-full bg-slate-700 rounded-xl p-4 flex justify-between items-center"
                    >
                      <span className="font-semibold">{subject.name}</span>
                      {expandedSemester === subject.id ? <ChevronDown /> : <ChevronRight />}
                    </button>
                    {expandedSemester === subject.id && (
                      <div className="bg-slate-700/50 rounded-b-xl p-4 mt-1">
                        {subject.formulas.map(formula => (
                          <div key={formula.id} className="bg-slate-600 rounded-xl p-3 mb-2">
                            <div className="font-semibold mb-1" style={{ color: theme.primary }}>{formula.title}</div>
                            {formula.formula && (
                              <div className="font-mono text-sm bg-slate-800 rounded-lg p-2 mb-2">{formula.formula}</div>
                            )}
                            {formula.image && (
                              <img src={formula.image} alt={formula.title} className="max-w-full h-auto rounded-xl mt-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-3 shadow-2xl">
          <div className="max-w-7xl mx-auto flex justify-around">
            {[
              { id: 'dashboard', icon: <Target size={24} />, label: 'Home' },
              { id: 'topics', icon: <BookOpen size={24} />, label: 'Topics' },
              { id: 'semesters', icon: <Calculator size={24} />, label: 'Subjects' },
              { id: 'formulas', icon: <Code size={24} />, label: 'Formulas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  activeTab === tab.id ? 'scale-110' : 'opacity-60'
                }`}
              >
                <div className={`p-2 rounded-xl ${activeTab === tab.id ? `bg-gradient-to-r ${theme.gradient}` : ''}`}>
                  {tab.icon}
                </div>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringStudyTracker;