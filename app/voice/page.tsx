"use client";

import { useState } from "react";
import { Mic, Upload, Play, Pause, Volume2, Trash2, CheckCircle } from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VoicePage() {
  const [voiceClones, setVoiceClones] = useState([
    {
      id: "voice_1",
      name: "Professional Voice",
      status: "ready",
      audioFile: "professional-sample.mp3",
      createdAt: "2024-01-15T00:00:00Z",
      isDefault: true
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        const newVoice = {
          id: `voice_${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          status: "processing" as const,
          audioFile: file.name,
          createdAt: new Date().toISOString(),
          isDefault: false
        };
        setVoiceClones(prev => [...prev, newVoice]);
        setIsUploading(false);
      }, 2000);
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // Add recording logic here
  };

  const handlePlay = (voiceId: string) => {
    setIsPlaying(isPlaying === voiceId ? null : voiceId);
    // Add audio playback logic here
  };

  const handleDelete = (voiceId: string) => {
    setVoiceClones(prev => prev.filter(voice => voice.id !== voiceId));
  };

  const handleSetDefault = (voiceId: string) => {
    setVoiceClones(prev => prev.map(voice => ({
      ...voice,
      isDefault: voice.id === voiceId
    })));
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-black/80">
      <DesktopNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MobileNav 
          filterByCountryId={null}
          searchQuery=""
          handleSearchChange={() => {}}
        />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-400">
                Voice Cloning
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage AI voice clones for automated Instagram audio messages
              </p>
            </div>

            <div className="space-y-6">
              {/* Voice Cloning Header */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    How Voice Cloning Works
                  </CardTitle>
                  <CardDescription>
                    Transform your voice into an AI model for personalized audio messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium mb-2">1. Upload Sample</h3>
                      <p className="text-sm text-gray-600">Upload 30-60 seconds of clear audio</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium mb-2">2. AI Analysis</h3>
                      <p className="text-sm text-gray-600">Our AI analyzes your voice patterns</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mic className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium mb-2">3. Voice Clone</h3>
                      <p className="text-sm text-gray-600">Generate your personalized voice model</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Play className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium mb-2">4. Auto Messages</h3>
                      <p className="text-sm text-gray-600">Send automated audio DMs at scale</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Voice Clone</CardTitle>
                  <CardDescription>
                    Upload an audio sample or record directly to create a new voice profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Upload Audio Sample</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drop your audio file here or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          MP3, WAV, M4A up to 10MB • 30-60 seconds recommended
                        </p>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="voice-upload"
                        />
                        <label htmlFor="voice-upload">
                          <Button variant="outline" className="cursor-pointer" disabled={isUploading}>
                            {isUploading ? "Uploading..." : "Select File"}
                          </Button>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Record Audio Sample</h4>
                      <div className="border rounded-lg p-8 text-center hover:shadow-sm transition-shadow">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-colors ${
                          isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                        }`}>
                          <Mic className="w-8 h-8" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {isRecording ? "Recording... Speak clearly for 30-60 seconds" : "Record directly from your microphone"}
                        </p>
                        <Button
                          onClick={handleRecord}
                          variant={isRecording ? "destructive" : "default"}
                          className={isRecording ? "" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}
                        >
                          {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Clones List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Voice Clones</CardTitle>
                  <CardDescription>
                    Manage and preview your voice profiles for automated messaging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {voiceClones.map((voice) => (
                      <div key={voice.id} className="flex items-center gap-4 p-6 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-lg">{voice.name}</h4>
                            {voice.isDefault && (
                              <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-pink-600">
                                Default
                              </Badge>
                            )}
                            {voice.status === "ready" && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {voice.status === "processing" && (
                              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {voice.status === "processing" ? (
                              "Processing audio sample..."
                            ) : (
                              `Created ${new Date(voice.createdAt).toLocaleDateString()} • Ready for use`
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {voice.status === "ready" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePlay(voice.id)}
                                className="flex items-center gap-2"
                              >
                                {isPlaying === voice.id ? (
                                  <>
                                    <Pause className="w-4 h-4" />
                                    Playing
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4" />
                                    Preview
                                  </>
                                )}
                              </Button>
                              
                              {!voice.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefault(voice.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                            </>
                          )}
                          
                          {!voice.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(voice.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {voiceClones.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Volume2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">No voice clones yet</h3>
                        <p className="text-gray-500 mb-4">Upload or record an audio sample to get started</p>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Create Your First Voice Clone
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Voice Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Voice Settings</CardTitle>
                  <CardDescription>
                    Configure how your cloned voice is used in automated campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Enable Audio Messages</h4>
                          <p className="text-sm text-gray-500">
                            Use cloned voice for automated audio DMs
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-purple-600"
                          defaultChecked
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Voice Quality</h4>
                          <p className="text-sm text-gray-500">
                            Higher quality uses more processing time
                          </p>
                        </div>
                        <select className="border rounded px-3 py-2 bg-white">
                          <option>Standard</option>
                          <option>High</option>
                          <option>Premium</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Speaking Speed</h4>
                          <p className="text-sm text-gray-500">
                            Adjust the pace of generated audio
                          </p>
                        </div>
                        <select className="border rounded px-3 py-2 bg-white">
                          <option>Slow</option>
                          <option defaultValue="true">Normal</option>
                          <option>Fast</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Audio Format</h4>
                          <p className="text-sm text-gray-500">
                            Choose output format for voice messages
                          </p>
                        </div>
                        <select className="border rounded px-3 py-2 bg-white">
                          <option defaultValue="true">MP3</option>
                          <option>WAV</option>
                          <option>M4A</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 