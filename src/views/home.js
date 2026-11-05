import { getStats } from '../services/storage.js';

export function renderHome(app) {
  const stats = getStats();

  app.innerHTML = `
    <div class="home-view">
      <section class="home-hero">
        <h1 class="hero-title">Tu biblioteca de recursos para aprender a programar</h1>
        <p class="hero-subtitle">Guarda, organiza y accede rápidamente a tus tutoriales, artículos y herramientas de estudio.</p>
        <div class="hero-actions">
          <a href="#/recursos" class="btn btn-primary">Empezar</a>
        </div>
      </section>

      <section class="home-section">
        <div class="stats-grid">
          <div class="card stat-card">
            <span class="stat-value">${stats.total}</span>
            <span class="stat-label">Recursos guardados</span>
          </div>
          <div class="card stat-card">
            <span class="stat-value">${stats.favoritos}</span>
            <span class="stat-label">Favoritos</span>
          </div>
          <div class="card stat-card">
            <span class="stat-value">${stats.temas}</span>
            <span class="stat-label">Temas</span>
          </div>
        </div>
      </section>

      <section class="home-section">
        <div class="features-grid">
          <div class="card feature-card">
            <h3 class="feature-title">Guardar</h3>
            <p class="feature-desc">Almacena enlaces a videos, documentación y cursos en un solo clic.</p>
          </div>
          <div class="card feature-card">
            <h3 class="feature-title">Organizar</h3>
            <p class="feature-desc">Clasifica tus recursos por temática, tipo de contenido y nivel de dificultad.</p>
          </div>
          <div class="card feature-card">
            <h3 class="feature-title">Encontrar</h3>
            <p class="feature-desc">Localiza fácilmente el material de estudio adecuado cuando lo necesites.</p>
          </div>
        </div>
      </section>
    </div>
  `;
}
