import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Send, CheckCircle, AlertCircle, Loader2, Globe, Volume2, VolumeX, 
  Upload, FileText, Calendar, Users, MapPin, DollarSign, Phone, Building,
  Sparkles, Copy, Download, Check, X, MessageSquare, Clock, Briefcase
} from 'lucide-react';

// API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = {
  processEmail: async (emailContent, language) => {
    const response = await fetch(`${API_BASE_URL}/api/process-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_content: emailContent, language })
    });
    if (!response.ok) throw new Error('Failed to process email');
    return response.json();
  },
  
  processReply: async (eventId, replyContent, roundNumber) => {
    const response = await fetch(`${API_BASE_URL}/api/process-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event_id: eventId, 
        reply_content: replyContent, 
        round_number: roundNumber 
      })
    });
    if (!response.ok) throw new Error('Failed to process reply');
    return response.json();
  },
  
  textToSpeech: async (text, language) => {
    const response = await fetch(`${API_BASE_URL}/api/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language })
    });
    if (!response.ok) throw new Error('Failed to generate speech');
    return response.json();
  }
};

// Language configurations
const languages = {
  English: { flag: '🇺🇸', name: 'English', voice: 'Aria' },
  Spanish: { flag: '🇪🇸', name: 'Español', voice: 'Elvira' },
  German: { flag: '🇩🇪', name: 'Deutsch', voice: 'Katja' },
  French: { flag: '🇫🇷', name: 'Français', voice: 'Denise' }
};

// Field Icons and Labels
const fieldConfig = {
  full_name: { icon: <Users className="w-4 h-4" />, label: 'Contact Name', emoji: '👤' },
  email: { icon: <Mail className="w-4 h-4" />, label: 'Email Address', emoji: '📧' },
  phone: { icon: <Phone className="w-4 h-4" />, label: 'Phone Number', emoji: '📱' },
  location: { icon: <MapPin className="w-4 h-4" />, label: 'Location', emoji: '📍' },
  event_name: { icon: <Calendar className="w-4 h-4" />, label: 'Event Name', emoji: '📅' },
  event_type: { icon: <Briefcase className="w-4 h-4" />, label: 'Event Type', emoji: '🎯' },
  number_of_attendees: { icon: <Users className="w-4 h-4" />, label: 'Attendees', emoji: '👥' },
  number_of_sleeping_rooms: { icon: <Building className="w-4 h-4" />, label: 'Hotel Rooms', emoji: '🏨' },
  budget: { icon: <DollarSign className="w-4 h-4" />, label: 'Budget', emoji: '💰' },
  event_start_date: { icon: <Calendar className="w-4 h-4" />, label: 'Start Date', emoji: '📅' },
  event_end_date: { icon: <Calendar className="w-4 h-4" />, label: 'End Date', emoji: '📅' }
};

// Component: Language Selector with Voice Info
const LanguageSelector = ({ selected, onChange, showVoiceInfo = true }) => (
  <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-200">
    <div className="flex items-center gap-3">
      <Globe className="w-5 h-5 text-blue-600" />
      <select 
        value={selected} 
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border-none outline-none bg-transparent font-medium text-gray-800"
      >
        {Object.entries(languages).map(([key, lang]) => (
          <option key={key} value={key}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
    {showVoiceInfo && (
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Volume2 className="w-4 h-4" />
          <span>Voice: {languages[selected].voice} (Neural)</span>
        </div>
      </div>
    )}
  </div>
);

// Component: Progress Tracker
const ProgressTracker = ({ currentRound, missingFields, totalFields = 11 }) => {
  const completedFields = totalFields - missingFields.length;
  const percentage = (completedFields / totalFields) * 100;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Progress Tracker</h3>
            <p className="text-sm text-gray-600">Round {currentRound}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{completedFields}/{totalFields}</p>
          <p className="text-sm text-gray-600">fields completed</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 relative"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Start</span>
            <span>{Math.round(percentage)}% Complete</span>
            <span>Finish</span>
          </div>
        </div>
        
        {missingFields.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-sm font-medium text-amber-800 mb-1">Missing Information:</p>
            <p className="text-sm text-amber-700">
              {missingFields.map(field => fieldConfig[field]?.label || field).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component: Event Info Card with Visual Design
const EventInfoCard = ({ data, missingFields }) => {
  const [copiedField, setCopiedField] = useState(null);
  
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          Event Information
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {data.event_id}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(fieldConfig).map(([key, config]) => {
          const isMissing = missingFields.includes(key);
          const value = data[key];
          
          return (
            <div 
              key={key} 
              className={`group relative flex items-start gap-3 p-4 rounded-xl transition-all ${
                isMissing 
                  ? 'bg-amber-50 border border-amber-200' 
                  : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`mt-0.5 ${isMissing ? 'text-amber-600' : 'text-gray-600'}`}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600">{config.label}</p>
                <p className={`font-semibold truncate ${
                  isMissing ? 'text-amber-700' : 'text-gray-900'
                }`}>
                  {value || (isMissing ? 'Required' : 'Not provided')}
                </p>
              </div>
              {value && !isMissing && (
                <button
                  onClick={() => copyToClipboard(value, key)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === key ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              )}
              {isMissing && <AlertCircle className="w-5 h-5 text-amber-600" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component: Email Display with Voice and Actions
const EmailDisplay = ({ email, title, type = 'followup', language, eventData }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const audioRef = useRef(null);
  
  const handleSpeak = async () => {
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      return;
    }
    
    try {
      setIsSpeaking(true);
      const response = await api.textToSpeech(email, language);
      
      // Convert base64 to audio and play
      const audio = new Audio(`data:audio/mp3;base64,${response.audio_base64}`);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      
      await audio.play();
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([email], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_email_${eventData?.event_id || 'draft'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Format email with visual summary for thank you emails
  const formatEmailContent = () => {
    if (type === 'complete' && eventData) {
      // Split the email to insert visual summary
      const parts = email.split('Here\'s a summary of what we have:');
      if (parts.length > 1) {
        return (
          <>
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
              {parts[0]}Here's a summary of what we have:
            </pre>
            <div className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-lg">{fieldConfig.event_name.emoji}</span>
                  <span className="font-medium">Event:</span> {eventData.event_name} ({eventData.event_type})
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">{fieldConfig.location.emoji}</span>
                  <span className="font-medium">Location:</span> {eventData.location}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">{fieldConfig.number_of_attendees.emoji}</span>
                  <span className="font-medium">Attendees:</span> {eventData.number_of_attendees} people
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">{fieldConfig.number_of_sleeping_rooms.emoji}</span>
                  <span className="font-medium">Hotel Rooms:</span> {eventData.number_of_sleeping_rooms} rooms
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">{fieldConfig.budget.emoji}</span>
                  <span className="font-medium">Budget:</span> {eventData.budget}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">{fieldConfig.event_start_date.emoji}</span>
                  <span className="font-medium">Dates:</span> {eventData.event_start_date} to {eventData.event_end_date}
                </p>
              </div>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
              {parts[1].split('Our team is already')[1] ? 'Our team is already' + parts[1].split('Our team is already')[1] : ''}
            </pre>
          </>
        );
      }
    }
    
    return <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{email}</pre>;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-600" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Volume2 className="w-4 h-4" />
            {languages[language].voice}
          </span>
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isSpeaking 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Speak
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-4 max-h-96 overflow-y-auto">
        {formatEmailContent()}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

// Component: Quick Stats
const QuickStats = ({ eventData }) => {
  if (!eventData) return null;
  
  const stats = [
    { label: 'Event Type', value: eventData.event_type || 'N/A', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Duration', value: eventData.event_start_date && eventData.event_end_date ? `${Math.ceil((new Date(eventData.event_end_date) - new Date(eventData.event_start_date)) / (1000 * 60 * 60 * 24)) + 1} days` : 'N/A', icon: <Clock className="w-5 h-5" /> },
    { label: 'Attendees', value: eventData.number_of_attendees || 'N/A', icon: <Users className="w-5 h-5" /> },
    { label: 'Location', value: eventData.location || 'N/A', icon: <MapPin className="w-5 h-5" /> }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            {stat.icon}
            <span className="text-sm">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// Main App Component
export default function AIMEMeetingPlanner() {
  const [language, setLanguage] = useState('English');
  const [emailContent, setEmailContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [showTips, setShowTips] = useState(true);

  // Sample email for demo
  const sampleEmail = `Dear Team,

My name is Priya, representing XYZ Corporation. We're in the early stages of planning our 2025 Annual Sales Conference and are exploring Chennai as our host city.

The event would span three days (July 25-27, 2025) and accommodate approximately 200 delegates. We're seeking a partner who can provide comprehensive conference solutions.

Could we schedule a call to discuss your capabilities and how you might support an event of this scale?

Thank you for your consideration,
Priya
XYZ Corporation`;

  const handleProcessEmail = async () => {
    if (!emailContent.trim()) {
      setError('Please enter an email to process');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await api.processEmail(emailContent, language);
      setCurrentEvent(result);
      setActiveTab('results');
      setShowTips(false);
    } catch (err) {
      setError('Failed to process email. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessReply = async () => {
    if (!replyContent.trim()) {
      setError('Please enter a reply email to process');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await api.processReply(
        currentEvent.event_id,
        replyContent,
        currentEvent.round_number
      );
      setCurrentEvent(result);
      setReplyContent('');
      setActiveTab('results');
    } catch (err) {
      setError('Failed to process reply. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const useSampleEmail = () => {
    setEmailContent(sampleEmail);
    setShowTips(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  AIME Meeting Planner
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">AI-Powered</span>
                </h1>
                <p className="text-sm text-gray-600">Transform emails into complete event information</p>
              </div>
            </div>
            <LanguageSelector selected={language} onChange={setLanguage} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        {currentEvent && <QuickStats eventData={currentEvent.extracted_data} />}
        
        {/* Progress Tracker */}
        {currentEvent && (
          <div className="mb-8">
            <ProgressTracker 
              currentRound={currentEvent.round_number}
              missingFields={currentEvent.missing_fields}
            />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        {currentEvent && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-1.5 inline-flex">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'input' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              New Email
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'results' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Results
            </button>
            {!currentEvent?.is_complete && (
              <button
                onClick={() => setActiveTab('reply')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'reply' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Process Reply
              </button>
            )}
          </div>
        )}

        {/* Content Based on Tab */}
        {activeTab === 'input' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-600" />
                Paste Meeting Request Email
              </h2>
              
              {showTips && !emailContent && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-3">
                    <strong>Tip:</strong> Paste any meeting or event request email, and our AI will extract all relevant information automatically.
                  </p>
                  <button
                    onClick={useSampleEmail}
                    className="text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                  >
                    Try with sample email →
                  </button>
                </div>
              )}
              
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste your meeting request email here..."
                className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              />
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </button>
                  <span className="text-sm text-gray-500">
                    Supports PDF, DOCX, XLSX
                  </span>
                </div>
                <button
                  onClick={handleProcessEmail}
                  disabled={isProcessing || !emailContent.trim()}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md font-medium"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Process Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && currentEvent && (
          <div className="space-y-6">
            <EventInfoCard 
              data={currentEvent.extracted_data} 
              missingFields={currentEvent.missing_fields}
            />
            
            <EmailDisplay
              email={currentEvent.followup_email}
              title={currentEvent.is_complete ? "Thank You Email" : "Follow-up Email"}
              type={currentEvent.is_complete ? "complete" : "followup"}
              language={language}
              eventData={currentEvent.is_complete ? currentEvent.extracted_data : null}
            />

            {currentEvent.is_complete && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2">All Information Collected!</h3>
                  <p className="text-green-700">
                    The event information is complete. A professional thank you email has been generated 
                    and is ready to send to the client. Your venue recommendations will be prepared within 24 hours.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reply' && currentEvent && !currentEvent.is_complete && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-600" />
              Process Client Reply
            </h2>
            
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-amber-800 mb-2">
                Still need the following information:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentEvent.missing_fields.map(field => (
                  <span key={field} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    {fieldConfig[field]?.label || field}
                  </span>
                ))}
              </div>
            </div>
            
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Paste the client's reply email here..."
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleProcessReply}
                disabled={isProcessing || !replyContent.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Reply...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Process Reply
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 AMEX Meetings & Events. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Powered by AI
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
