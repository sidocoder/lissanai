"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Camera,
  Edit3,
  Share2,
  MoreHorizontal,
  MessageSquare,
  Award,
  Star,
  Clock,
  MapPin,
  Calendar,
  Shield,
  Mail,
  Phone,
  Globe,
  BookOpen,
  Mic,
  Activity,
  LogOut,
} from "lucide-react";

export default function Profile() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<
    "overview" | "progress" | "activity" | "awards"
  >("overview");
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    provider: "",
    created_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Fetch user data from API on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.accessToken) {
        setLoading(false);
        // Optionally, redirect to login or show a message if session is required
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }
        const data = await response.json();
        setUser({
          name: data.name || session.user?.name || "User",
          email: data.email || session.user?.email || "",
          bio: data.settings?.bio || "",
          provider: data.provider || session.user?.provider || "N/A",
          created_at: data.created_at || new Date().toISOString(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [session]); // Dependency on session

  // Update user data via API on save
  const handleSave = async () => {
    if (!session?.accessToken) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            name: user.name,
            settings: { bio: user.bio },
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user data");
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatarImage");
    const savedBackground = localStorage.getItem("backgroundImage");

    if (savedAvatar) setAvatarImage(savedAvatar);
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    } else {
      // Set default background if none saved
      setBackgroundImage(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5QkHAGP89CW8-TkQ-po-xygiSom_SCGe4WQ&s"
      );
    }
  }, []); // Runs once on mount

  // Save images to localStorage whenever they change (using Base64)
  useEffect(() => {
    if (avatarImage) {
      localStorage.setItem("avatarImage", avatarImage);
    } else {
      localStorage.removeItem("avatarImage");
    }
  }, [avatarImage]);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem("backgroundImage", backgroundImage);
    } else {
      localStorage.removeItem("backgroundImage");
    }
  }, [backgroundImage]);

  const achievements = [
    {
      title: "Week Warrior",
      description: "7-day learning streak",
      icon: <Activity className="h-5 w-5 text-green-600" />,
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Grammar Pro",
      description: "Completed 35 grammar sessions",
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Email Expert",
      description: "Drafted 10 professional emails",
      icon: <Mail className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Perfect Score",
      description: "100% on pronunciation test",
      icon: <Mic className="h-5 w-5 text-orange-600" />,
      color: "bg-orange-50 border-orange-200",
    },
  ];

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  };
  const handleLogout = async () => {
    if (!session?.refreshToken) {
      // Fallback if no refresh token
      signOut({ callbackUrl: "/" });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: session.refreshToken, // Adjust if stored differently in session
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to logout");
      // On success, clear client session
      signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Logout API error:", err);
      // Fallback to client-side logout
      signOut({ callbackUrl: "/" });
    }
  };

  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-white"></div>
          <p className="text-white font-bold text-lg">Loading...</p>
        </div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header avatarImage={avatarImage} />

      {/* Cover + Profile header */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative -mt-16 bg-white rounded-xl shadow-sm border p-6 overflow-hidden" // Added overflow-hidden for rounded corners
            style={{
              // Apply background style directly to this div for "fitted to card"
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5QkHAGP89CW8-TkQ-po-xygiSom_SCGe4WQ&s)",
              backgroundSize: "cover", // Ensures image covers the area
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "220px", // Adjust height for the background area within the card
              paddingTop: "6rem", // Push content down below the background area
              display: "flex", // Use flex to position content
              flexDirection: "column",
            }}
          >
            {/* Background change button - move it inside this div and adjust positioning */}
            <button
              onClick={() => backgroundInputRef.current?.click()}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow border hover:bg-gray-50 z-10"
              aria-label="Change background"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
            <input
              type="file"
              ref={backgroundInputRef}
              onChange={handleBackgroundChange}
              accept="image/*"
              className="hidden"
            />

            {/* Profile content starts here, pushed down by paddingTop */}
            <div className="relative z-20 mt-auto bg-white rounded-b-xl -mx-6 -mb-6 px-6 pt-2 pb-6">
              {" "}
              {/* Added mt-auto to push to bottom, and bg for content area */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative -mt-16">
                    {" "}
                    {/* Adjust negative margin to position avatar */}
                    <div
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold bg-cover bg-center border-4 border-white shadow-md"
                      style={{
                        backgroundImage: avatarImage
                          ? `url(${avatarImage})`
                          : undefined,
                      }}
                    >
                      {!avatarImage &&
                        (user.name ? user.name.charAt(0).toUpperCase() : "U")}
                    </div>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow border hover:bg-gray-50 z-10"
                      aria-label="Change avatar"
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    {isEditing ? (
                      <div className="space-y-2 mt-2">
                        {" "}
                        {/* Added mt-2 for spacing with avatar */}
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                          }
                          className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                          placeholder="Username"
                        />
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                          }
                          className="text-sm text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                          placeholder="Email"
                        />
                      </div>
                    ) : (
                      <div className="mt-2">
                        {" "}
                        {/* Added mt-2 for spacing with avatar */}
                        <h1 className="text-2xl font-bold text-gray-900">
                          {user.name}
                        </h1>
                        <div className="text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-1">
                          <span className="inline-flex items-center">
                            <MapPin className="h-4 w-4 mr-1" /> New York, USA
                          </span>
                          <span className="inline-flex items-center">
                            <Calendar className="h-4 w-4 mr-1" /> Joined{" "}
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center">
                            <Shield className="h-4 w-4 mr-1" /> Intermediate
                            Level
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white inline-flex items-center gap-2 hover:from-green-600 hover:to-blue-600"
                  >
                    <Edit3 className="h-4 w-4" />{" "}
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                  </button>
                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white inline-flex items-center gap-2 hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
              {/* Editable Bio */}
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="Bio"
                  />
                ) : (
                  <p className="text-gray-700">{user.bio}</p>
                )}
              </div>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">47</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">28</div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">156</div>
                  <div className="text-sm text-gray-600">Hours Practiced</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
              {/* Tabs */}
              <div className="mt-6 border-b flex items-center gap-6 text-sm">
                {(["overview", "progress", "activity", "awards"] as const).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`py-3 -mb-px border-b-2 ${
                        activeTab === t
                          ? "border-green-600 text-green-700 font-medium"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {t[0].toUpperCase() + t.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page remains the same */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <section className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Achievements & Badges
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {achievements.map((a, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${a.color}`}
                    >
                      <div className="mt-0.5">{a.icon}</div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {a.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {a.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                    <Award className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Mock Interview Completed
                      </div>
                      <div className="text-sm text-gray-600">
                        Frontend Developer role — Score 89%
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                      2 hours ago
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                    <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Email Draft Generated
                      </div>
                      <div className="text-sm text-gray-600">
                        Job application for remote position
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                      1 day ago
                    </span>
                  </li>
                </ul>
              </section>
            </div>
          )}

          {activeTab === "progress" && (
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Learning Progress
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <div className="flex items-center justify-between">
                    <span>Pronunciation Score</span>
                    <span className="font-bold">94%</span>
                  </div>
                  <div className="w-full h-2 bg-white/30 rounded-full mt-2">
                    <div className="h-2 bg-white rounded-full w-[94%]"></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center justify-between">
                    <span>Grammar Mastery</span>
                    <span className="font-bold">88%</span>
                  </div>
                  <div className="w-full h-2 bg-white/30 rounded-full mt-2">
                    <div className="h-2 bg-white rounded-full w-[88%]"></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "activity" && (
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Activity Log
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="h-4 w-4" /> Practiced pronunciation for 25
                    minutes
                  </div>
                  <span className="text-xs text-gray-500">Today 10:20</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3 text-gray-700">
                    <BookOpen className="h-4 w-4" /> Completed grammar session
                    on tenses
                  </div>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </li>
              </ul>
            </section>
          )}

          {activeTab === "awards" && (
            <section className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Awards
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-yellow-50">
                  <div className="flex items-center gap-3 mb-1">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">
                      Consistency Champion
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Maintained a 30-day active streak
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-blue-50">
                  <div className="flex items-center gap-3 mb-1">
                    <Star className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      Top 100 Rank
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Reached top 100 globally this week
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center justify-between">
                <span>Total Study Time</span>
                <span className="font-medium">156 hours</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Current Level</span>
                <span className="font-medium">Intermediate</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Best Streak</span>
                <span className="font-medium">12 days</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Rank</span>
                <span className="font-medium">#87</span>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-500" />
                <span>www.lissanai.com</span>
              </li>
            </ul>
          </section>
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Explore</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <Activity className="h-4 w-4" /> Dashboard
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </section>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
