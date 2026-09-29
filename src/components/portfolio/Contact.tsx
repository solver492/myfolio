import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: 'var(--xp-font)', height: '100%', overflow: 'auto', padding: 8 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          background: 'var(--xp-title-gradient)',
          color: 'white',
          padding: '4px 8px',
          marginBottom: 16,
        }}
      >
        📧 Me Contacter
      </h2>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: 'center',
              padding: 32,
              background: '#d4edda',
              border: '1px solid #c3e6cb',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 16, marginBottom: 8, color: '#155724' }}>Message envoyé !</h3>
            <p style={{ fontSize: 13, color: '#155724', marginBottom: 16 }}>
              Merci pour votre message. Je vous répondrai dans les plus brefs délais.
            </p>
            <button
              className="xp-btn"
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
            >
              Nouveau message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                  Nom *
                </label>
                <input
                  className="xp-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                  style={{ width: '100%' }}
                  aria-label="Votre nom"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                  Email *
                </label>
                <input
                  className="xp-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  style={{ width: '100%' }}
                  aria-label="Votre email"
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                Sujet
              </label>
              <select
                className="xp-input"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                style={{ width: '100%' }}
                aria-label="Sujet du message"
              >
                <option value="">Sélectionner un sujet</option>
                <option value="projet">Proposition de projet</option>
                <option value="collaboration">Collaboration</option>
                <option value="freelance">Mission freelance</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                Message *
              </label>
              <textarea
                className="xp-input"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Votre message..."
                required
                rows={6}
                style={{ width: '100%', resize: 'vertical', display: 'block' }}
                aria-label="Votre message"
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                type="submit"
                className="xp-btn"
                style={{
                  background: 'var(--xp-start-gradient)',
                  color: 'white',
                  border: '1px solid #2A7A2A',
                  fontWeight: 'bold',
                  fontSize: 12,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={sending}
              >
                {sending ? '⏳ Envoi...' : '📤 Envoyer'}
              </motion.button>
              <button
                type="button"
                className="xp-btn"
                style={{ fontSize: 12 }}
                onClick={() => setForm({ name: '', email: '', subject: '', message: '' })}
              >
                Effacer
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
