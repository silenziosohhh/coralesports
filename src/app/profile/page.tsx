import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Target, TrendingUp, Award, Calendar, Users } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const wins = session.user.wins || 0;
  const losses = session.user.losses || 0;
  const totalMatches = wins + losses;
  const winRate = totalMatches > 0 
    ? ((wins / totalMatches) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <Card className="bg-darkslategray-100 border-deepskyblue-300 mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32 ring-4 ring-cyan/30">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback className="bg-cyan/20 text-cyan text-4xl">
                  {session.user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                  <h1 className="text-3xl font-bold text-white">{session.user.name}</h1>
                  <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 md:mt-0">
                    <Badge variant={session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                      {session.user.role}
                    </Badge>
                    <Badge variant={session.user.status === "ACTIVE" ? "default" : "destructive"}>
                      {session.user.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray mb-4">{session.user.discordTag || "Discord not connected"}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-cyan" />
                    <span className="text-gray">ELO:</span>
                    <span className="font-bold text-cyan">{session.user.elo || 1000}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-gray">Wins:</span>
                    <span className="font-bold text-white">{session.user.wins || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-gray">Losses:</span>
                    <span className="font-bold text-white">{session.user.losses || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple" />
                    <span className="text-gray">Win Rate:</span>
                    <span className="font-bold text-white">{winRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Statistics */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-cyan" />
                <CardTitle>Statistics</CardTitle>
              </div>
              <CardDescription>Your performance overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray">Total Matches</span>
                <span className="font-bold text-white">{(session.user.wins || 0) + (session.user.losses || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray">Current ELO</span>
                <span className="font-bold text-cyan">{session.user.elo || 1000}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray">Win Rate</span>
                <span className="font-bold text-white">{winRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray">Rank</span>
                <Badge variant="secondary">Unranked</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-cyan" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <CardDescription>Your latest matches and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray mx-auto mb-3" />
                <p className="text-gray">No recent activity</p>
              </div>
            </CardContent>
          </Card>

          {/* Teams */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-cyan" />
                <CardTitle>Teams</CardTitle>
              </div>
              <CardDescription>Your team memberships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray mx-auto mb-3" />
                <p className="text-gray">Not in any teams</p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-cyan" />
                <CardTitle>Achievements</CardTitle>
              </div>
              <CardDescription>Your earned badges and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray mx-auto mb-4" />
                <p className="text-gray text-lg">No achievements yet</p>
                <p className="text-gray/60 text-sm mt-2">Start competing to earn your first achievement!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
