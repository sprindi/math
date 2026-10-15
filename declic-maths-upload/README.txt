Déclic Maths — Arithmétique dans ℕ

Static French revision app for the arithmetic chapter in the three supplied lesson photos. Intended level: Moroccan tronc commun (confirm the student's stream with their teacher).

Hosting on GitHub Pages

Upload these thirteen files at the root of a GitHub repository:
  index.html
  style.css
  exam.css
  app.js
  content.js
  resources.js
  exam-data.js
  exam.js
  controle-sujet.pdf
  controle-corrige.pdf
  correction.html
  correction-arithmetique.pdf
  .nojekyll

In the repository: Settings → Pages → Build and deployment → Deploy from a branch → select your branch, / (root) → Save.
GitHub displays the site URL once deployed. Relative file paths support project repositories. No build command, API keys, backend or package installation needed for the student. Do not upload .venv or test-output.

You can also open index.html directly in a browser. Progress is browser-local and may behave differently for file:// URLs. GitHub Pages is recommended for consistent storage. All lessons and questions are bundled; videos and outside resources need internet. This is not an installed offline/PWA app.

Learning design

Read a lesson, attempt its questions, and explain why an answer is right on paper. Four-choice questions provide immediate step-by-step feedback and optional hints. Viewing the solution does not count as mastering a question. Errors can be retried via the topic selector. Correct answers on a retry count only when the solution has not been opened during that attempt; a hint remains allowed. No claim of durable mastery is made from a single successful QCM answer.

The control is now a written-style, original 60-minute synthesis subject: five exercises, twenty subquestions, proposed rubric totaling 20 points. It uses source-backed patterns (proofs, prime tests, factorization, digit constraints and divisor systems), not multiple-choice answers. Answers can be drafted in textareas or on paper. Drafts survive reload if localStorage works. After submission, solutions and 39 partial-credit criteria appear. Students tick the elements actually written; the displayed score is explicitly SELF-ASSESSMENT, not automatic grading or a teacher's mark. Equivalent correct methods are accepted in principle. The written exam never automatically changes the practice mastery/error list. Suggested time is not an enforced countdown. PDF subject and correction are also available separately, so corrections are not technically secret.

Revision priorities are explained inside the exam tab with specific exercise references. The source collection is an exercise catalogue, not a teacher's past exam set; repetition and reprints are not probabilities. No guarantee is made about the next exam or its length/marking. Uncertain photo/OCR formulas are not silently reused. The legacy exam=true markers in the QCM practice data are no longer used by the control.

Sources and scope

The three source photos were read using local Tesseract OCR after both vision routes failed. Chapter headings were readable, but OCR errors make some exponents and printed examples uncertain. This app uses newly written, checked examples rather than treating uncertain OCR as exact text. Never publish the private WhatsApp images with this repository without permission.

The school name in Casablanca was not provided. The exercise-resource section contains only the Digischool PDF chosen by the user: https://digischool.ma/wp-content/uploads/2024/01/arithmetique-dans-in-exercices-non-corriges-9-1.pdf . It is a seven-exercise general tronc commun sheet attributed to Prof. Atmani Najib, not a verified paper from that school. An independently authored, unofficial four-page correction is bundled as correction-arithmetique.pdf and readable as correction.html. Exercise 3.3 literally requests PGCD(74,185) and PPCM(48,72); the solution preserves this and separately labels PPCM(74,185)=370 as a possible intended alternative. External videos are selected for topic fit; listing/search verification is not the same as watching and comparing every explanation. See resources.json / resource notes for the actual checks and limitations.

No accounts, analytics, cookies, cloud storage or student data collection. Progress is saved in localStorage if available; the app continues in memory if storage fails. Effacer ma progression requires confirmation.

Developer verification

A separate local-only .venv contains Playwright and SymPy. Run:
  .venv/bin/python test_app.py
  .venv/bin/python test_math.py
  .venv/bin/python test_sheet.py
  .venv/bin/python test_written_exam.py

To regenerate the written subject/correction PDFs from the same data used by the app:
  .venv/bin/python build_exam_pdfs.py

Tests launch an isolated headless browser, not the user's desktop browser. They use a temporary local HTTP server bound to loopback and stop it after testing. They check real interactions, mobile overflow, storage failures, scoring and static subpath hosting. Mathematical checks use SymPy as an independent oracle where applicable; pedagogy remains a human-review question.
