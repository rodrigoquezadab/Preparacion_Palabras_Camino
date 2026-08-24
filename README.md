# 📖 Preparación de la Palabra — Camino Neocatecumenal
### *Liturgy of the Word Preparation — Neocatechumenal Way*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Source: Léon-Dufour](https://img.shields.io/badge/Source-Léon--Dufour-emerald.svg)](https://leondufour.com/)
[![Bible: Biblia de Jerusalén](https://img.shields.io/badge/Bible-Biblia%20de%20Jerusalén-purple.svg)](https://leondufour.com/)
[![Coverage: 100%](https://img.shields.io/badge/Coverage-100%25%20Verified-green.svg)]()

---

> **Idiomas / Languages:** [🇪🇸 Español](#-español) | [🇬🇧 English](#-english)

---

## 🇪🇸 Español

### 1. Descripción General y Propósito

Esta aplicación web está diseñada para **facilitar y enriquecer la preparación de la Liturgia de la Palabra en las comunidades del Camino Neocatecumenal**. 

Semanalmente, un grupo de hermanos de la comunidad prepara la celebración de la Palabra en torno a un tema o palabra bíblica extraída del **Vocabulario de Teología Bíblica de Xavier Léon-Dufour**. La aplicación automatiza y optimiza la búsqueda de citas, la comprobación de criterios litúrgicos, la lectura de los textos sagrados y la distribución equitativa de las lecturas entre los participantes.

---

### 2. Características Principales

#### 🌱 A. Lista Oficial de 148 Palabras del Precatecumenado
- **Modo Oficial por Defecto:** Incluye las **148 palabras del documento oficial del Camino** para la fase del Precatecumenado, respetando su correlativo y numeración original (`#1 Agua`, `#2 Aceite`, `#3 Amén`, `#4 Adán`... hasta `#148 Voluntad de Dios`).
- **Selector de Modo Rápido:** Permite alternar entre la lista de **148 palabras del Precatecumenado** y la totalidad de los **289 términos** del Vocabulario de Xavier Léon-Dufour.

#### 👥 B. Calculadora de Participantes y Reparto Lineal Continuo
- **Búsqueda Lineal Continua ($Génesis \rightarrow Apocalipsis$):** Las citas se dividen en estricto orden canónico continuo, de modo que cada hermano avanza siempre hacia adelante en su propia Biblia física sin tener que retroceder ni dar saltos.
- **Transparencia y Balanceo por Caracteres Reales:** El algoritmo pondera la longitud real del texto bíblico en caracteres. Esto garantiza que un hermano con varias lecturas de un solo versículo (ej. 16 lecturas) y otro con lecturas extensas (ej. 6 lecturas) tengan la misma carga y tiempo de lectura (~3.200 caracteres).
- **Badges Informativos:** Muestra el número de citas, el total de caracteres (`🔤 ~8.180 car.`) y el porcentaje de texto asignado a cada participante.
- **Exportación para WhatsApp:** Botones de un solo toque para copiar la asignación individual o el reparto completo grupal formateado.

#### 🔗 C. Fusión de Perícopas y Rangos Contiguos
- **Motor Matemático de Intervalos:** Une automáticamente citas adyacentes o solapadas dentro de un mismo libro y capítulo (ej. `Gen 12,1-4` + `Gen 12,5-9` $\rightarrow$ `Gen 12,1-9`).
- **Alternador Interactivo:** Permite cambiar con un clic entre *Perícopas Unidas* (listas para proclamar) y *Citas Sueltas* (fuente original).

#### 📖 D. Visor Bíblico Integrado (100% Biblia de Jerusalén)
- **Texto Sagrado Completo:** Base de datos con los 73 libros canónicos (1.335 capítulos, 35.549 versículos) integrados localmente sin textos faltantes.
- **Resaltado Inteligente:** Al abrir cualquier cita, el visor resalta los versículos específicos de la perícopa dentro del capítulo completo.
- **Superposición Inteligente de Modales:** La lectura bíblica se abre por encima de la calculadora sin cerrarla, permitiendo explorar varias citas consecutivas.

#### 📱 E. Diseño Mobile-First & Guía Litúrgica
- **Optimizado para Móviles:** Interfaz táctil ergonómica y rápida para su uso en reuniones comunitarias de preparación.
- **Tooltips Explicativos:** Cada botón y control dispone de textos descriptivos.
- **Centro de Ayuda (`📖 Guía`):** Explicación de las 4 partes litúrgicas, reglas del Camino y nomenclatura bíblica (`s`, `ss`, `p`, `.`, `-`, `,`, `a,b,c`).

---

### 3. Fuentes de Datos Oficiales

1. **Vocabulario Teológico:** [Xavier Léon-Dufour](https://leondufour.com/) (*Vocabulario de Teología Bíblica*, Editorial Herder). 25.845 citas auditadas.
2. **Texto Bíblico:** *Biblia de Jerusalén* (Editorial Desclée de Brouwer).

---

### 4. Instalación y Uso Local

La aplicación es estática y no requiere servidor de backend ni bases de datos complejas.

```bash
# Clonar el repositorio
git clone https://github.com/rodrigoquezadab/Preparacion_Palabras_Camino.git

# Entrar en el directorio
cd Preparacion_Palabras_Camino

# Abrir directamente en el navegador o mediante un servidor estático
# Ejemplo con Python:
python -m http.server 8080

# Ejemplo con Node.js:
npx serve .
```

---
---

## 🇬🇧 English

### 1. Overview & Purpose

This web application is designed to **facilitate and enrich the preparation of the Liturgy of the Word in communities of the Neocatechumenal Way**.

Every week, a group of brothers and sisters prepares the community's Liturgy of the Word based on a theological topic or word from **Xavier Léon-Dufour's Vocabulary of Biblical Theology**. The application automates citation discovery, validates liturgical requirements, offers full in-app Bible reading, and provides an equitable, linear distribution of readings among participants.

---

### 2. Key Features

#### 🌱 A. Official 148 Pre-catechumenate Words List
- **Default Official Mode:** Includes the **148 words from the official document of the Neocatechumenal Way** for the Pre-catechumenate stage, preserving the original order and numbering (`#1 Water`, `#2 Oil`, `#3 Amen`, `#4 Adam`... up to `#148 Will of God`).
- **Quick Mode Switcher:** Seamlessly switch between the **148 Pre-catechumenate words** and the complete **289 terms** from Xavier Léon-Dufour's vocabulary.

#### 👥 B. Participant Reading Calculator & Continuous Linear Distribution
- **Continuous Linear Bible Search ($Genesis \rightarrow Revelation$):** Readings are partitioned strictly in canonical biblical order, ensuring each person progresses forward through their physical Bible without having to jump back and forth.
- **Character-Based Load Balancing:** Weights readings by actual biblical text character count. This ensures transparent balancing: a participant with multiple short 1-verse citations (e.g., 16 readings) and another with long chapters (e.g., 6 readings) receive an equivalent workload (~3,200 characters).
- **Workload Indicators:** Displays reading count, character count (`🔤 ~8,180 chars`), and text percentage per participant.
- **WhatsApp Share Buttons:** One-tap buttons to copy individual assignments or the entire group distribution formatted for messaging.

#### 🔗 C. Pericope Interval Merging
- **Mathematical Interval Fusion:** Automatically merges adjacent or overlapping citations within the same book and chapter (e.g., `Gen 12:1-4` + `Gen 12:5-9` $\rightarrow$ `Gen 12:1-9`).
- **Toggle View:** Switch between *Merged Pericopes* (ready for proclamation) and *Original Citations*.

#### 📖 D. Built-in Bible Reader (100% Jerusalem Bible)
- **Complete Sacred Text:** Integrated database with all 73 Catholic canonical books (1,335 chapters, 35,549 verses) with 0 missing texts.
- **Smart Verse Highlighting:** Opening any citation highlights the specific verses within the full chapter context.
- **Layered Modal Navigation:** The scripture reader opens seamlessly on top of the calculator without closing it, allowing users to inspect multiple readings without losing their place.

#### 📱 E. Mobile-First Ergonomics & Liturgical Guide
- **Designed for Smartphones:** Fast, touch-friendly UI tailored for mobile devices used during preparation meetings.
- **Interactive Tooltips:** Every button includes descriptive text explaining its function.
- **Help Center (`📖 Guía`):** Detailed explanations of the 4 liturgical parts, community rules, and biblical notation (`s`, `ss`, `p`, `.`, `-`, `,`, `a,b,c`).

---

### 3. Canonical Sources

1. **Theological Vocabulary:** [Xavier Léon-Dufour](https://leondufour.com/) (*Dictionary of Biblical Theology*). Over 25,845 audited citations.
2. **Biblical Text:** *Biblia de Jerusalén* (Editorial Desclée de Brouwer).

---

### 4. Local Setup & Usage

The application is client-side and requires no external backend or database setup.

```bash
# Clone repository
git clone https://github.com/rodrigoquezadab/Preparacion_Palabras_Camino.git

# Navigate to workspace
cd Preparacion_Palabras_Camino

# Serve locally
python -m http.server 8080
# or with Node:
npx serve .
```

---

### 📄 License

This project is licensed under the [MIT License](LICENSE).
