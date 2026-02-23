import React, { useState } from "react";
const API = import.meta.env.VITE_API_URL;

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API}5000/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to send message");
      return;
    }

    alert("Message sent successfully 🎉");
    setForm({ name: "", email: "", subject: "", message: "" });

  } catch (err) {
    alert("Server not responding");
  }
};

  return (
    <div className="pt-20 animate-fade-in">

      {/* HERO */}
      <section className="py-28 bg-gradient-to-b from-white via-emerald-50/40 to-white text-center">
        <h1 className="text-6xl font-black text-slate-900 mb-6">Contact Us</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Have questions about EduNest? Need support? Our team is ready to help you.
        </p>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="grid md:grid-cols-3 gap-10">

          {[
            { title: "Email Us", desc: "support@edunest.com", icon: "📧" },
            { title: "Call Us", desc: "+91 98765 43210", icon: "📞" },
            { title: "Visit Us", desc: "Kolkata, India", icon: "📍" }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-emerald-100 text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-start">

        {/* FORM */}
        <div className="bg-white rounded-[3rem] border border-emerald-100 shadow-xl p-12">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Send us a message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none"
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none"
            />

            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none"
            />

            <textarea
  name="message"
  rows={5}
  value={form.message}
  onChange={handleChange}
  placeholder="Write your message..."
  className="w-full px-5 py-4 rounded-2xl bg-slate-900 text-white placeholder:text-slate-400 border border-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
/>


            <button className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl font-black hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Send Message
            </button>
          </form>
        </div>

        {/* MAP */}
        <div className="rounded-[3rem] overflow-hidden shadow-xl border border-emerald-100 h-[500px]">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=kolkata&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-white to-emerald-50/40 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-10">Quick Help</h2>

          <div className="space-y-6 text-left">
            {[
              ["How do I enroll in a class?", "Go to subjects → login → enroll."],
              ["How do I reset password?", "Click forgot password on login page."],
              ["How do teachers upload notes?", "Teachers can upload from dashboard."]
            ].map(([q, a], i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">{q}</h4>
                <p className="text-slate-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
