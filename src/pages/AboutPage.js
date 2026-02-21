import { BookOpen, Target, Users, Globe, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Akses Terbuka",
    description:
      "Menyediakan akses terbuka terhadap karya ilmiah untuk mendukung perkembangan pengetahuan dan riset di Indonesia.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Target,
    title: "Pencarian Mudah",
    description:
      "Fitur pencarian dan filter canggih memudahkan pengguna menemukan repositori yang relevan dengan cepat dan tepat.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Users,
    title: "Kolaborasi Akademik",
    description:
      "Platform ini mendorong kolaborasi antar peneliti dan institusi akademik untuk menghasilkan karya yang lebih berkualitas.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Globe,
    title: "Jangkauan Luas",
    description:
      "Repositori dapat diakses dari mana saja, memperluas dampak dan visibilitas karya ilmiah secara global.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-orange-500/30 selection:text-orange-900" data-testid="about-page">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-24 md:py-32">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-gradient-to-b from-orange-50 to-transparent blur-3xl opacity-70" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[80%] rounded-full bg-gradient-to-t from-slate-100 to-transparent blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Tentang Kami</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6 animate-fade-in-up animation-delay-100" data-testid="about-title">
            Membangun Masa Depan <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Riset Indonesia
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Platform repositori akademik digital modern yang dirancang untuk mengelola, melindungi, dan memaksimalkan dampak dari setiap karya keilmuan.
          </p>
        </div>
      </section>

      {/* 2. Visi Misi Split Section */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Content */}
            <div className="order-2 lg:order-1 space-y-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-6">Cerita & Visi Kami</h2>
                <div className="w-20 h-1.5 bg-orange-500 rounded-full mb-8" />
              </div>
              
              <div className="prose prose-lg text-slate-600 leading-relaxed">
                <p>
                  Scholar Repository berawal dari visi sederhana: <strong>pengetahuan harus dapat diakses oleh siapa saja, di mana saja.</strong> Kami melihat banyaknya karya ilmiah brilian yang hanya tersimpan di perpustakaan lokal tanpa pernah menjangkau audiens yang lebih luas.
                </p>
                <p>
                  Platform ini dikembangkan secara spesifik untuk memecahkan masalah tersebut. Kami membangun infrastruktur digital untuk mendukung ekosistem penelitian dengan memfasilitasi pertukaran pengetahuan antar akademisi secara terbuka dan aman.
                </p>
                <p>
                  Dengan desain yang berpusat pada pengguna (user-centric), Scholar Repository berkomitmen untuk menjadikan proses menemukan, mengakses, dan mengunduh penelitian menjadi sebuah pengalaman yang lancar dan menyenangkan.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-600">+</div>
                </div>
                <p className="text-sm font-medium text-slate-600">Didukung oleh ratusan peneliti aktif</p>
              </div>
            </div>

            {/* Right Visual (Abstract Cards) */}
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square relative rounded-3xl bg-slate-100 overflow-hidden border border-slate-200/60 shadow-inner">
                {/* Decorative abstract patterns inside the image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 via-slate-50 to-white opacity-80" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-video bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 transform -rotate-6 transition-transform hover:rotate-0 duration-500">
                  <div className="w-1/3 h-4 bg-slate-100 rounded-full mb-4" />
                  <div className="w-full h-3 bg-slate-50 rounded-full mb-2" />
                  <div className="w-5/6 h-3 bg-slate-50 rounded-full mb-2" />
                  <div className="w-4/6 h-3 bg-slate-50 rounded-full mb-6" />
                  <div className="flex justify-between items-center mt-auto">
                    <div className="w-8 h-8 rounded-full bg-orange-50" />
                    <div className="w-20 h-6 rounded-full bg-slate-100" />
                  </div>
                </div>

                <div className="absolute bottom-[10%] -right-[5%] w-[60%] aspect-video bg-white rounded-2xl shadow-2xl shadow-slate-300/40 border border-slate-100 p-5 transform rotate-3 transition-transform hover:rotate-0 duration-500 z-10 hidden md:block">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                       <div className="w-24 h-3 bg-slate-100 rounded-full mb-2 mt-1" />
                       <div className="w-16 h-2 bg-slate-50 rounded-full" />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full mb-2" />
                  <div className="w-full h-2 bg-slate-50 rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-6" data-testid="about-features-title">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg text-slate-600">
              Dibangun dengan standar teknologi terkini untuk memastikan setiap karya akademik terkelola dengan aman, terstruktur, dan mudah ditemukan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={feature.title}
                className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 hover:-translate-y-1"
                data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <div className="absolute bottom-8 left-8 flex items-center text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span className={feature.color}>Pelajari</span>
                  <ChevronRight className={`w-4 h-4 ml-1 ${feature.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
