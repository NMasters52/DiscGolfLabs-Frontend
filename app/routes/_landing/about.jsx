import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Target,
  Trophy,
  Zap,
  BookOpen,
  Heart,
  Award,
  BarChart3,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-500/5 to-purple-500/5 py-24 lg:py-32">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-200 h-150 rounded-full blur-[150px]"
            style={{ background: "rgba(109,234,249,0.03)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Badge className="mb-6">Our Story</Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
            Built by players, for players
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mx-auto">
            Disc Golf Lab was born from a simple frustration: the putting game was being taught
            as an art form, when it's really a science. We built the platform we wished
            existed when we were struggling with consistency on the green.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">The Problem</h2>
                <div className="space-y-3 text-muted-foreground text-[15px] leading-relaxed">
                  <p>
                    Most disc golfers treat putting like magic—you watch pros, try to copy their
                    form, and hope it works. But here's the truth: pro putting mechanics
                    are built on fundamental physics principles that apply to everyone.
                  </p>
                  <p>
                    The problem wasn't lack of information—it was lack of structure. Players
                    were jumping between random YouTube videos, magazine tips, and advice from friends
                    who were also struggling. No one was offering a systematic way to diagnose
                    and fix mechanical flaws.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold">The Solution</h2>
                <div className="space-y-3 text-muted-foreground text-[15px] leading-relaxed">
                  <p>
                    We built Disc Golf Lab around the putting ladder—a simple tool that
                    quantifies what was previously subjective. By tracking make rates at different
                    distances, we can identify exactly where your form breaks down and why.
                  </p>
                  <p>
                    This isn't about perfect mechanics. It's about building your personal
                    best form through deliberate practice and measurable progress. The data tells us
                    what to work on, and the drills teach us how to fix it.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Founder Bio Card */}
              <Card className="bg-muted/30">
                <CardContent className="pt-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-border">
                      <span className="text-2xl font-bold text-foreground">🏌️</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Founded by Disc Golfers</h3>
                      <p className="text-sm text-muted-foreground">
                        A team of touring professionals, coaches, and data analysts who share one
                        mission: make disc golf putting approachable and measurable for everyone.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Our approach combines:
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-primary shrink-0" />
                        <span>Tour experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-primary shrink-0" />
                        <span>Proven coaching methods</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-primary shrink-0" />
                        <span>Data-driven insights</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-primary shrink-0" />
                        <span>Research-backed drills</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Statement */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-8">
                  <div className="flex items-start gap-3 mb-4">
                    <Heart className="h-6 w-6 text-primary shrink-0" />
                    <h3 className="text-xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground text-[15px] leading-relaxed">
                    To help disc golfers at every level build sustainable improvement through
                    data-driven practice. We believe putting shouldn't be a mystery—it should
                    be a skill you can see, measure, and master over time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Overview */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12 space-y-4">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary">
              Foundation First
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Our Training Philosophy
            </h2>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mx-auto">
              We don't teach tricks—we teach fundamentals. Here's what makes our approach different:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Root-Cause Analysis",
                description:
                  "We don't just fix symptoms. We identify the mechanical root cause of your misses through systematic testing and video analysis.",
              },
              {
                icon: BarChart3,
                title: "Measurable Progress",
                description:
                  "Every session is tracked and quantified. You'll see your make rates improve by distance over time, removing all doubt about whether you're getting better.",
              },
              {
                icon: Zap,
                title: "Pressure Training",
                description:
                  "Form without pressure is useless. Our drills simulate the mental load of competition, training your brain to stay calm when it matters most.",
              },
              {
                icon: Award,
                title: "Individualized Plans",
                description:
                  "No one-size-fits-all advice. Your training adapts to your specific weaknesses, strengths, and learning style.",
              },
              {
                icon: BookOpen,
                title: "Science-Based",
                description:
                  "Every drill is grounded in physics, biomechanics, and sports psychology research. We separate myth from methodology.",
              },
              {
                icon: Trophy,
                title: "Community Support",
                description:
                  "Join a community of serious players who share insights, celebrate wins, and push each other to improve.",
              },
            ].map((philosophy, index) => (
              <Card
                key={index}
                className="group transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="pt-6 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <philosophy.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{philosophy.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {philosophy.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ready to transform your game?
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl mx-auto">
            Join thousands of disc golfers who have discovered that putting improvement
            isn't magic—it's a process anyone can master with the right tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              View Our Courses
            </a>
            <a
              href="/methodology"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border bg-card font-semibold hover:bg-muted transition-colors"
            >
              Learn Our Methodology
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}