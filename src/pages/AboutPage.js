import { BookOpen, Target, Users, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: BookOpen,
    title: "Akses Terbuka",
    description:
      "Menyediakan akses terbuka terhadap karya ilmiah untuk mendukung perkembangan pengetahuan dan riset di Indonesia.",
  },
  {
    icon: Target,
    title: "Pencarian Mudah",
    description:
      "Fitur pencarian dan filter canggih memudahkan pengguna menemukan repositori yang relevan dengan cepat dan tepat.",
  },
  {
    icon: Users,
    title: "Kolaborasi Akademik",
    description:
      "Platform ini mendorong kolaborasi antar peneliti dan institusi akademik untuk menghasilkan karya yang lebih berkualitas.",
  },
  {
    icon: Globe,
    title: "Jangkauan Luas",
    description:
      "Repositori dapat diakses dari mana saja, memperluas dampak dan visibilitas karya ilmiah secara global.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen" data-testid="about-page">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-2">
            Tentang Kami
          </p>
          <h1
            className="font-serif text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight"
            data-testid="about-title"
          >
            Tentang Scholar Repository
          </h1>
          <p className="text-base text-[#334155] mt-2 max-w-2xl">
            Platform repositori akademik digital untuk mengelola dan berbagi
            karya ilmiah.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Content */}
        <div className="max-w-3xl">
          <Card className="border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6 md:p-10">
              <h2 className="font-serif text-2xl font-semibold text-[#0F172A] mb-6">
                Visi & Misi
              </h2>
              <div className="space-y-4 text-[#334155] leading-relaxed">
                <p>
                  Scholar Repository adalah platform repositori akademik digital
                  yang didedikasikan untuk mengelola, menyimpan, dan membagikan
                  karya ilmiah dari berbagai disiplin ilmu. Kami percaya bahwa
                  pengetahuan harus dapat diakses oleh siapa saja, di mana saja.
                </p>
                <p>
                  Platform ini dikembangkan dengan tujuan untuk mendukung
                  ekosistem penelitian di Indonesia, memfasilitasi pertukaran
                  pengetahuan antar akademisi, dan meningkatkan visibilitas
                  karya ilmiah Indonesia di kancah internasional.
                </p>
                <p>
                  Dengan antarmuka yang modern dan intuitif, Scholar Repository
                  memudahkan pengguna untuk menemukan, mengakses, dan mengunduh
                  berbagai penelitian akademik yang relevan dengan minat dan
                  kebutuhan mereka.
                </p>
              </div>

              <Separator className="my-8 bg-[#E2E8F0]" />

              <h2 className="font-serif text-2xl font-semibold text-[#0F172A] mb-4">
                Siapa Kami
              </h2>
              <p className="text-[#334155] leading-relaxed">
                Kami adalah tim yang terdiri dari akademisi, pengembang, dan
                desainer yang berkomitmen untuk membangun infrastruktur digital
                yang mendukung kemajuan pendidikan dan penelitian di Indonesia.
                Bersama-sama, kami berupaya menciptakan platform yang tidak
                hanya fungsional, tetapi juga menyenangkan untuk digunakan.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2
            className="font-serif text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight mb-8"
            data-testid="about-features-title"
          >
            Mengapa Scholar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="w-11 h-11 rounded-lg bg-[#F0F9FF] flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#0F172A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
