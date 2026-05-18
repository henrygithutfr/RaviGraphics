import { Link } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Trophy,
  Clock,
  Users,
  Truck,
  ShieldCheck,
  Award,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Printer,
  Palette,
  Rocket,
  Globe,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import SEO from "./SEO";

export default function About() {
  const stats = [
    { number: "500+", label: "Projects Completed", icon: Trophy },
    { number: "50+", label: "Happy Clients", icon: Users },
    { number: "5+", label: "Years Experience", icon: Clock },
    { number: "100%", label: "Quality Guarantee", icon: ShieldCheck }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We work closely with you to bring your vision to life."
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "We use only the finest materials and latest printing technology for exceptional results."
    },
    {
      icon: Rocket,
      title: "Fast Turnaround",
      description: "Quick delivery without compromising on quality. Most orders completed within 3-5 days."
    },
    {
      icon: TrendingUp,
      title: "Competitive Pricing",
      description: "High-quality printing at affordable rates. Get the best value for your money."
    }
  ];

  const features = [
    {
      icon: Printer,
      title: "State-of-the-art Printing",
      description: "Modern digital and offset printing equipment for crisp, vibrant results."
    },
    {
      icon: Palette,
      title: "Custom Design Support",
      description: "Professional designers to help create or refine your artwork."
    },
    {
      icon: Globe,
      title: "Pan India Delivery",
      description: "Fast and reliable shipping across all major cities in India."
    },
    {
      icon: ShieldCheck,
      title: "Eco-friendly Materials",
      description: "Sustainable printing options with recycled paper and eco-friendly inks."
    }
  ];

  return (
    <>  
    <SEO 
      title="About Ravi Graphics | Printing & Graphic Design Services in Odisha"
      description="Ravi Graphics provides professional printing and graphic design services in Odisha, including business cards, banners, brochures, posters, stickers and custom print solutions with fast turnaround."
    />
    
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-amber-100 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center mt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Ravi Graphics
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Where quality meets excellence — delivering premium printing solutions since 2019
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-orange-600 font-medium">About Us</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        
        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium text-sm uppercase tracking-wide">Our Story</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Crafting Excellence Since 2019
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Ravi Graphics was founded with a simple mission: to provide businesses and individuals 
                with premium quality printing services at affordable prices. What started as a small 
                local print shop has grown into a trusted name in the printing industry.
              </p>
              <p>
                Over the years, we've invested in state-of-the-art printing technology and built a team 
                of passionate professionals who take pride in every project, big or small.
              </p>
              <p>
                Today, we serve hundreds of satisfied customers across India, from small businesses 
                and startups to established corporations and event planners. Our commitment to quality, 
                attention to detail, and customer-centric approach sets us apart.
              </p>
            </div>
          </div>
          
          <div className="rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <img 
      src="https://i.ibb.co/qL0jbcPN/Shop.webp" 
      alt="Ravi Graphics Office" 
      className="rounded-lg max-w-full h-auto mb-4"
      loading="lazy"
    />
              <p className="text-orange-800 font-medium italic">
                "Quality is not an act, it's a habit."
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <stat.icon className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium text-sm uppercase tracking-wide">Core Values</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              What Drives Us
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our principles guide everything we do, from first contact to final delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 transition-all hover:shadow-md"
              >
                <div className="p-2 bg-orange-100 rounded-lg inline-block mb-3">
                  <value.icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features/Services Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium text-sm uppercase tracking-wide">Why Choose Us</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              What Makes Us Different
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We combine technology, expertise, and dedication to deliver exceptional results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-5 border border-gray-200 flex items-start gap-4 hover:shadow-md transition-all"
              >
                <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial / Trust Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 mb-16 border border-orange-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-md">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Trusted by Businesses Across India
                </h3>
                <p className="text-gray-600">
                  Join hundreds of satisfied customers who rely on us for their printing needs
                </p>
              </div>
            </div>
            <Link 
              to="/contact"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all whitespace-nowrap flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Contact Info Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Call Us</p>
              <p className="font-medium text-gray-800">+91 8480154045</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mail className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email Us</p>
              <p className="font-medium text-gray-800">info@ravigraphics.com</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Service Area</p>
              <p className="font-medium text-gray-800">Pan India Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}