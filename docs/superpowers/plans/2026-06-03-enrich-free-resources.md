# Enrich Free Resources Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3–5 high-quality, verified free resources (videos, courses, interactive platforms, free books) to every skill MDX file across all 30 skills.

**Architecture:** Pure content task — each skill's MDX frontmatter `resources` list gets additional entries appended. No code changes, no tests. Resources are sourced from well-known free platforms: freeCodeCamp, The Odin Project, CS50/Harvard, MIT OCW, Kaggle Learn, Google Developers, DeepLearning.AI, GitHub Skills, interactive tools, and top YouTube educators.

**Tech Stack:** MDX frontmatter (YAML), git

---

## File Map

All files are in `content/skills/` relative to the project root `C:\Users\BOSS\Downloads\roadmap app\roadmap-app`.

| Task | Skills modified |
|---|---|
| Task 1 | `html-css.mdx`, `javascript.mdx`, `react.mdx` |
| Task 2 | `nodejs.mdx`, `databases.mdx`, `rest-apis.mdx`, `authentication.mdx`, `testing-backend.mdx` |
| Task 3 | `linux.mdx`, `git.mdx`, `ci-cd.mdx`, `docker.mdx`, `kubernetes.mdx`, `cloud.mdx`, `monitoring.mdx` |
| Task 4 | `python.mdx`, `sql.mdx`, `statistics.mdx`, `pandas-numpy.mdx`, `data-visualization.mdx` |
| Task 5 | `machine-learning.mdx`, `deep-learning.mdx`, `llms.mdx`, `mlops.mdx` |
| Task 6 | `vector-databases.mdx`, `ai-agents.mdx`, `data-pipelines.mdx`, `cloud-data.mdx`, `spark.mdx`, `streaming.mdx` |

**YAML format reminder** — each new resource entry looks like:
```yaml
  - title: Resource Title
    url: https://example.com
    type: docs      # one of: docs | video | course | article
    free: true
```
Add entries **inside** the existing `resources:` list, before the closing `---`.

---

## Task 1: Frontend Skills — HTML/CSS, JavaScript, React

**Files:**
- Modify: `content/skills/html-css.mdx`
- Modify: `content/skills/javascript.mdx`
- Modify: `content/skills/react.mdx`

- [ ] **Step 1: Add resources to `content/skills/html-css.mdx`**

Append these entries to the `resources:` list (before `---`):
```yaml
  - title: The Odin Project — Foundations
    url: https://www.theodinproject.com/paths/foundations
    type: course
    free: true
  - title: Kevin Powell — CSS YouTube Channel
    url: https://www.youtube.com/@KevinPowell
    type: video
    free: true
  - title: Flexbox Froggy (interactive game)
    url: https://flexboxfroggy.com
    type: course
    free: true
  - title: CSS Grid Garden (interactive game)
    url: https://cssgridgarden.com
    type: course
    free: true
  - title: Scrimba — Learn HTML & CSS
    url: https://scrimba.com/learn/htmlcss
    type: course
    free: true
  - title: freeCodeCamp — Responsive Web Design Certification
    url: https://www.freecodecamp.org/learn/2022/responsive-web-design/
    type: course
    free: true
```

- [ ] **Step 2: Add resources to `content/skills/javascript.mdx`**

Append these entries to the `resources:` list:
```yaml
  - title: The Odin Project — JavaScript
    url: https://www.theodinproject.com/paths/full-stack-javascript
    type: course
    free: true
  - title: JavaScript30 – Wes Bos (30 projects in 30 days)
    url: https://javascript30.com
    type: course
    free: true
  - title: You Don't Know JS (free book series)
    url: https://github.com/getify/You-Dont-Know-JS
    type: article
    free: true
  - title: freeCodeCamp — JavaScript Algorithms & Data Structures
    url: https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/
    type: course
    free: true
  - title: The Net Ninja — JavaScript Tutorials
    url: https://www.youtube.com/playlist?list=PL4cUxeGkcC9haFPT7J25Q9GRB_ZkFrCA5
    type: video
    free: true
  - title: CS50x – Harvard (Introduction to CS with JavaScript)
    url: https://cs50.harvard.edu/x/
    type: course
    free: true
```

- [ ] **Step 3: Add resources to `content/skills/react.mdx`**

Append these entries to the `resources:` list:
```yaml
  - title: Scrimba — Learn React (free interactive course)
    url: https://scrimba.com/learn/learnreact
    type: course
    free: true
  - title: The Net Ninja — React Tutorial for Beginners
    url: https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d
    type: video
    free: true
  - title: Web Dev Simplified — Learn React Hooks
    url: https://www.youtube.com/watch?v=O6P86uwfdR0
    type: video
    free: true
  - title: React Dev — Official Interactive Tutorial
    url: https://react.dev/learn
    type: course
    free: true
  - title: freeCodeCamp — Front End Development Libraries
    url: https://www.freecodecamp.org/learn/front-end-development-libraries/
    type: course
    free: true
```

- [ ] **Step 4: Verify the server still responds**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/html-css
```
Expected: `200`

- [ ] **Step 5: Commit**

```bash
cd "C:\Users\BOSS\Downloads\roadmap app\roadmap-app"
git add content/skills/html-css.mdx content/skills/javascript.mdx content/skills/react.mdx
git commit -m "content: enrich frontend skills with free courses, interactive tools, and videos"
```

---

## Task 2: Backend Skills — Node.js, Databases, REST APIs, Auth, Testing

**Files:**
- Modify: `content/skills/nodejs.mdx`
- Modify: `content/skills/databases.mdx`
- Modify: `content/skills/rest-apis.mdx`
- Modify: `content/skills/authentication.mdx`
- Modify: `content/skills/testing-backend.mdx`

- [ ] **Step 1: Add resources to `content/skills/nodejs.mdx`**

Append to `resources:` list:
```yaml
  - title: The Net Ninja — Node.js Crash Course
    url: https://www.youtube.com/playlist?list=PL4cUxeGkcC9jszmQoOs5jd0q1MZIl8rzg
    type: video
    free: true
  - title: Node.js Best Practices (GitHub)
    url: https://github.com/goldbergyoni/nodebestpractices
    type: article
    free: true
  - title: freeCodeCamp — APIs and Microservices Certification
    url: https://www.freecodecamp.org/learn/back-end-development-and-apis/
    type: course
    free: true
  - title: Web Dev Simplified — Node.js Tutorial
    url: https://www.youtube.com/watch?v=ENrzD9HAZK4
    type: video
    free: true
```

- [ ] **Step 2: Add resources to `content/skills/databases.mdx`**

Append to `resources:` list:
```yaml
  - title: CS50 SQL – Harvard (free)
    url: https://cs50.harvard.edu/sql/
    type: course
    free: true
  - title: Use The Index, Luke! (SQL performance free book)
    url: https://use-the-index-luke.com
    type: article
    free: true
  - title: Database Design Course – freeCodeCamp
    url: https://www.youtube.com/watch?v=ztHopE5Wnpc
    type: video
    free: true
  - title: Redis University (free courses)
    url: https://university.redis.com
    type: course
    free: true
```

- [ ] **Step 3: Add resources to `content/skills/rest-apis.mdx`**

Append to `resources:` list:
```yaml
  - title: APIs for Beginners – freeCodeCamp
    url: https://www.youtube.com/watch?v=GZvSYJDk-us
    type: video
    free: true
  - title: REST API Design Best Practices – freeCodeCamp
    url: https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
    type: article
    free: true
  - title: Postman API Fundamentals (free badge)
    url: https://academy.postman.com/path/postman-api-fundamentals-student-expert
    type: course
    free: true
  - title: HTTP Cats (fun HTTP status code reference)
    url: https://http.cat
    type: docs
    free: true
```

- [ ] **Step 4: Add resources to `content/skills/authentication.mdx`**

Append to `resources:` list:
```yaml
  - title: CS50 Web — Authentication Lecture (Harvard)
    url: https://cs50.harvard.edu/web/2020/weeks/7/
    type: video
    free: true
  - title: Auth0 Developer Documentation & Guides
    url: https://auth0.com/docs
    type: docs
    free: true
  - title: PassportJS Official Guide
    url: https://www.passportjs.org/docs/
    type: docs
    free: true
  - title: OWASP Authentication Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
    type: article
    free: true
```

- [ ] **Step 5: Add resources to `content/skills/testing-backend.mdx`**

Append to `resources:` list:
```yaml
  - title: Testing Library Docs
    url: https://testing-library.com/docs/
    type: docs
    free: true
  - title: JavaScript Testing – Traversy Media
    url: https://www.youtube.com/watch?v=7r4xVDI2vho
    type: video
    free: true
  - title: Test-Driven Development – freeCodeCamp
    url: https://www.freecodecamp.org/news/test-driven-development-what-it-is-and-what-it-is-not-41fa6bca02a2/
    type: article
    free: true
  - title: Vitest Docs
    url: https://vitest.dev/guide/
    type: docs
    free: true
```

- [ ] **Step 6: Verify routes respond**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/nodejs && echo " nodejs ok"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/authentication && echo " auth ok"
```
Expected: `200 nodejs ok` and `200 auth ok`

- [ ] **Step 7: Commit**

```bash
cd "C:\Users\BOSS\Downloads\roadmap app\roadmap-app"
git add content/skills/nodejs.mdx content/skills/databases.mdx content/skills/rest-apis.mdx content/skills/authentication.mdx content/skills/testing-backend.mdx
git commit -m "content: enrich backend skills with free courses, guides, and videos"
```

---

## Task 3: DevOps Skills — Linux, Git, CI/CD, Docker, Kubernetes, Cloud, Monitoring

**Files:**
- Modify: `content/skills/linux.mdx`
- Modify: `content/skills/git.mdx`
- Modify: `content/skills/ci-cd.mdx`
- Modify: `content/skills/docker.mdx`
- Modify: `content/skills/kubernetes.mdx`
- Modify: `content/skills/cloud.mdx`
- Modify: `content/skills/monitoring.mdx`

- [ ] **Step 1: Add resources to `content/skills/linux.mdx`**

Append to `resources:` list:
```yaml
  - title: The Missing Semester of Your CS Education – MIT
    url: https://missing.csail.mit.edu
    type: course
    free: true
  - title: Linux Journey (interactive web tutorial)
    url: https://linuxjourney.com
    type: course
    free: true
  - title: Ryan's Linux Tutorial
    url: https://ryanstutorials.net/linuxtutorial/
    type: article
    free: true
  - title: NetworkChuck — Linux for Hackers (YouTube)
    url: https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL
    type: video
    free: true
```

- [ ] **Step 2: Add resources to `content/skills/git.mdx`**

Append to `resources:` list:
```yaml
  - title: GitHub Skills (interactive labs)
    url: https://skills.github.com
    type: course
    free: true
  - title: Git Immersion (guided tour)
    url: https://gitimmersion.com
    type: course
    free: true
  - title: Atlassian Git Tutorials
    url: https://www.atlassian.com/git/tutorials
    type: docs
    free: true
  - title: Fireship — Git It? How to use Git (video)
    url: https://www.youtube.com/watch?v=HkdAHXoRtos
    type: video
    free: true
```

- [ ] **Step 3: Add resources to `content/skills/ci-cd.mdx`**

Append to `resources:` list:
```yaml
  - title: GitHub Actions Quickstart
    url: https://docs.github.com/en/actions/quickstart
    type: docs
    free: true
  - title: DevOps with GitLab CI – freeCodeCamp
    url: https://www.youtube.com/watch?v=qP8kir2GUgo
    type: video
    free: true
  - title: GitHub Actions in 2024 – TechWorld with Nana
    url: https://www.youtube.com/watch?v=R8_veQiYBjI
    type: video
    free: true
  - title: Continuous Delivery Foundation — Free Training
    url: https://cd.foundation/training/
    type: course
    free: true
```

- [ ] **Step 4: Add resources to `content/skills/docker.mdx`**

Append to `resources:` list:
```yaml
  - title: Docker Handbook – freeCodeCamp
    url: https://www.freecodecamp.org/news/the-docker-handbook/
    type: article
    free: true
  - title: KodeKloud — Docker for Absolute Beginners (free tier)
    url: https://kodekloud.com/courses/docker-for-the-absolute-beginner/
    type: course
    free: true
  - title: Fireship — Docker in 100 Seconds
    url: https://www.youtube.com/watch?v=Gjnup-PuquQ
    type: video
    free: true
  - title: Docker Curriculum (comprehensive free guide)
    url: https://docker-curriculum.com
    type: article
    free: true
```

- [ ] **Step 5: Add resources to `content/skills/kubernetes.mdx`**

Append to `resources:` list:
```yaml
  - title: Kubernetes by Example (interactive)
    url: https://kubernetesbyexample.com
    type: course
    free: true
  - title: KodeKloud — Kubernetes for Beginners (free tier)
    url: https://kodekloud.com/courses/kubernetes-for-the-absolute-beginners-hands-on/
    type: course
    free: true
  - title: CNCF — Free Kubernetes Training
    url: https://www.cncf.io/certification/training/
    type: course
    free: true
  - title: Fireship — Kubernetes Explained in 100 Seconds
    url: https://www.youtube.com/watch?v=PziYflu8cB8
    type: video
    free: true
```

- [ ] **Step 6: Add resources to `content/skills/cloud.mdx`**

Append to `resources:` list:
```yaml
  - title: AWS Cloud Quest (free gamified learning)
    url: https://aws.amazon.com/training/digital/aws-cloud-quest/
    type: course
    free: true
  - title: Google Cloud Skills Boost (free learning path)
    url: https://www.cloudskillsboost.google
    type: course
    free: true
  - title: Microsoft Learn — Azure Fundamentals (free)
    url: https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/
    type: course
    free: true
  - title: AWS Skill Builder — Free Digital Training
    url: https://skillbuilder.aws
    type: course
    free: true
```

- [ ] **Step 7: Add resources to `content/skills/monitoring.mdx`**

Append to `resources:` list:
```yaml
  - title: Google SRE Book (free online)
    url: https://sre.google/sre-book/table-of-contents/
    type: article
    free: true
  - title: OpenTelemetry Docs
    url: https://opentelemetry.io/docs/
    type: docs
    free: true
  - title: Grafana Play (live interactive sandbox)
    url: https://play.grafana.org
    type: course
    free: true
  - title: Monitoring & Observability – freeCodeCamp
    url: https://www.freecodecamp.org/news/how-to-monitor-your-infrastructure/
    type: article
    free: true
```

- [ ] **Step 8: Verify routes respond**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/docker && echo " docker ok"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/kubernetes && echo " k8s ok"
```
Expected: `200 docker ok` and `200 k8s ok`

- [ ] **Step 9: Commit**

```bash
cd "C:\Users\BOSS\Downloads\roadmap app\roadmap-app"
git add content/skills/linux.mdx content/skills/git.mdx content/skills/ci-cd.mdx content/skills/docker.mdx content/skills/kubernetes.mdx content/skills/cloud.mdx content/skills/monitoring.mdx
git commit -m "content: enrich devops skills with free courses, interactive labs, and videos"
```

---

## Task 4: Data Science Foundations — Python, SQL, Statistics, Pandas/NumPy, Data Viz

**Files:**
- Modify: `content/skills/python.mdx`
- Modify: `content/skills/sql.mdx`
- Modify: `content/skills/statistics.mdx`
- Modify: `content/skills/pandas-numpy.mdx`
- Modify: `content/skills/data-visualization.mdx`

- [ ] **Step 1: Add resources to `content/skills/python.mdx`**

Append to `resources:` list:
```yaml
  - title: CS50P — Introduction to Programming with Python (Harvard)
    url: https://cs50.harvard.edu/python/
    type: course
    free: true
  - title: Kaggle — Python Micro-Course
    url: https://www.kaggle.com/learn/python
    type: course
    free: true
  - title: Corey Schafer — Python Tutorials (YouTube playlist)
    url: https://www.youtube.com/playlist?list=PL-osiE80TeTskrapMs1zKTAqi-O1DURbd
    type: video
    free: true
  - title: Real Python — Tutorials & Guides
    url: https://realpython.com
    type: article
    free: true
  - title: Google's Python Class (free)
    url: https://developers.google.com/edu/python
    type: course
    free: true
```

- [ ] **Step 2: Add resources to `content/skills/sql.mdx`**

Append to `resources:` list:
```yaml
  - title: SQLBolt (interactive SQL lessons)
    url: https://sqlbolt.com
    type: course
    free: true
  - title: W3Schools SQL Tutorial (interactive)
    url: https://www.w3schools.com/sql/
    type: docs
    free: true
  - title: Kaggle — Intro to SQL
    url: https://www.kaggle.com/learn/intro-to-sql
    type: course
    free: true
  - title: CS50 SQL – Harvard (2024)
    url: https://cs50.harvard.edu/sql/2024/
    type: course
    free: true
  - title: Select Star SQL (interactive book)
    url: https://selectstarsql.com
    type: article
    free: true
```

- [ ] **Step 3: Add resources to `content/skills/statistics.mdx`**

Append to `resources:` list:
```yaml
  - title: Seeing Theory (visual probability & statistics)
    url: https://seeing-theory.brown.edu
    type: article
    free: true
  - title: Think Stats – free book (Allen Downey)
    url: https://greenteapress.com/thinkstats2/
    type: article
    free: true
  - title: MIT OCW — Statistics for Applications
    url: https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/
    type: course
    free: true
  - title: 3Blue1Brown — Probability Playlist
    url: https://www.youtube.com/playlist?list=PLZHQObOWTQDOjmo3Y6ADm0ScWAlEXf-fp
    type: video
    free: true
```

- [ ] **Step 4: Add resources to `content/skills/pandas-numpy.mdx`**

Append to `resources:` list:
```yaml
  - title: Kaggle — Pandas Micro-Course
    url: https://www.kaggle.com/learn/pandas
    type: course
    free: true
  - title: Data Analysis with Python – freeCodeCamp
    url: https://www.youtube.com/watch?v=r-uOLxNrNk8
    type: video
    free: true
  - title: NumPy Illustrated – freeCodeCamp
    url: https://www.freecodecamp.org/news/numpy-illustrated-the-visual-guide-to-numpy-3b1d4976de1d/
    type: article
    free: true
  - title: Kaggle — Data Cleaning Micro-Course
    url: https://www.kaggle.com/learn/data-cleaning
    type: course
    free: true
```

- [ ] **Step 5: Add resources to `content/skills/data-visualization.mdx`**

Append to `resources:` list:
```yaml
  - title: Kaggle — Data Visualization Micro-Course
    url: https://www.kaggle.com/learn/data-visualization
    type: course
    free: true
  - title: The Data Visualisation Catalogue (reference)
    url: https://datavizcatalogue.com
    type: article
    free: true
  - title: Plotly Express Docs & Tutorials
    url: https://plotly.com/python/plotly-express/
    type: docs
    free: true
  - title: From Data to Viz (chart type selector)
    url: https://www.data-to-viz.com
    type: article
    free: true
```

- [ ] **Step 6: Verify routes respond**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/python && echo " python ok"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/sql && echo " sql ok"
```
Expected: `200 python ok` and `200 sql ok`

- [ ] **Step 7: Commit**

```bash
cd "C:\Users\BOSS\Downloads\roadmap app\roadmap-app"
git add content/skills/python.mdx content/skills/sql.mdx content/skills/statistics.mdx content/skills/pandas-numpy.mdx content/skills/data-visualization.mdx
git commit -m "content: enrich data science foundation skills with free courses, Kaggle, and interactive tools"
```

---

## Task 5: ML/AI Skills — Machine Learning, Deep Learning, LLMs, MLOps

**Files:**
- Modify: `content/skills/machine-learning.mdx`
- Modify: `content/skills/deep-learning.mdx`
- Modify: `content/skills/llms.mdx`
- Modify: `content/skills/mlops.mdx`

- [ ] **Step 1: Add resources to `content/skills/machine-learning.mdx`**

Append to `resources:` list:
```yaml
  - title: Google ML Crash Course (free)
    url: https://developers.google.com/machine-learning/crash-course
    type: course
    free: true
  - title: Kaggle — Intro to Machine Learning
    url: https://www.kaggle.com/learn/intro-to-machine-learning
    type: course
    free: true
  - title: Stanford CS229 – Machine Learning (Andrew Ng, free lectures)
    url: https://cs229.stanford.edu
    type: course
    free: true
  - title: Sentdex — ML from Scratch (YouTube)
    url: https://www.youtube.com/watch?v=OGxgnH8y2NM
    type: video
    free: true
  - title: Kaggle — Intermediate Machine Learning
    url: https://www.kaggle.com/learn/intermediate-machine-learning
    type: course
    free: true
```

- [ ] **Step 2: Add resources to `content/skills/deep-learning.mdx`**

Append to `resources:` list:
```yaml
  - title: 3Blue1Brown — Neural Networks (visual series)
    url: https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi
    type: video
    free: true
  - title: MIT 6.S191 — Introduction to Deep Learning
    url: http://introtodeeplearning.com
    type: course
    free: true
  - title: Andrej Karpathy — Neural Nets: Zero to Hero
    url: https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ
    type: video
    free: true
  - title: Kaggle — Deep Learning Micro-Course
    url: https://www.kaggle.com/learn/deep-learning-for-computer-vision
    type: course
    free: true
```

- [ ] **Step 3: Add resources to `content/skills/llms.mdx`**

Append to `resources:` list:
```yaml
  - title: DeepLearning.AI — Short Courses (free access)
    url: https://www.deeplearning.ai/short-courses/
    type: course
    free: true
  - title: OpenAI Cookbook (examples & guides)
    url: https://cookbook.openai.com
    type: docs
    free: true
  - title: LLM University – Cohere
    url: https://docs.cohere.com/docs/llmu
    type: course
    free: true
  - title: Prompt Engineering Guide
    url: https://www.promptingguide.ai
    type: article
    free: true
  - title: Andrej Karpathy — Let's build the GPT Tokenizer
    url: https://www.youtube.com/watch?v=zduSFxRajkE
    type: video
    free: true
```

- [ ] **Step 4: Add resources to `content/skills/mlops.mdx`**

Append to `resources:` list:
```yaml
  - title: MLOps Zoomcamp – DataTalks.Club (free)
    url: https://github.com/DataTalksClub/mlops-zoomcamp
    type: course
    free: true
  - title: Weights & Biases — Free Courses
    url: https://www.wandb.courses/
    type: course
    free: true
  - title: Google MLOps: Continuous Delivery Guide
    url: https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning
    type: article
    free: true
  - title: DVC — Data Version Control Docs
    url: https://dvc.org/doc
    type: docs
    free: true
```

- [ ] **Step 5: Verify routes respond**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/machine-learning && echo " ml ok"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/llms && echo " llms ok"
```
Expected: `200 ml ok` and `200 llms ok`

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\BOSS\Downloads\roadmap app\roadmap-app"
git add content/skills/machine-learning.mdx content/skills/deep-learning.mdx content/skills/llms.mdx content/skills/mlops.mdx
git commit -m "content: enrich ML/AI skills with free courses, DeepLearning.AI, Google, and video playlists"
```

---

## Task 6: Advanced AI & Data Engineering Skills

**Files:**
- Modify: `content/skills/vector-databases.mdx`
- Modify: `content/skills/ai-agents.mdx`
- Modify: `content/skills/data-pipelines.mdx`
- Modify: `content/skills/cloud-data.mdx`
- Modify: `content/skills/spark.mdx`
- Modify: `content/skills/streaming.mdx`

- [ ] **Step 1: Add resources to `content/skills/vector-databases.mdx`**

Append to `resources:` list:
```yaml
  - title: DeepLearning.AI — Vector Databases & Embeddings (free)
    url: https://www.deeplearning.ai/short-courses/vector-databases-embeddings-applications/
    type: course
    free: true
  - title: Weaviate Academy (free learning path)
    url: https://weaviate.io/developers/academy
    type: course
    free: true
  - title: Qdrant — Tutorials & Examples
    url: https://qdrant.tech/documentation/tutorials/
    type: docs
    free: true
  - title: Fireship — Vector Databases Explained
    url: https://www.youtube.com/watch?v=klTvEwg3oJ4
    type: video
    free: true
```

- [ ] **Step 2: Add resources to `content/skills/ai-agents.mdx`**

Append to `resources:` list:
```yaml
  - title: DeepLearning.AI — AI Agents in LangGraph (free)
    url: https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/
    type: course
    free: true
  - title: LangChain Academy (free courses)
    url: https://academy.langchain.com
    type: course
    free: true
  - title: Microsoft AutoGen Tutorial (docs)
    url: https://microsoft.github.io/autogen/docs/tutorial/
    type: docs
    free: true
  - title: DeepLearning.AI — Multi AI Agent Systems (free)
    url: https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/
    type: course
    free: true
```

- [ ] **Step 3: Add resources to `content/skills/data-pipelines.mdx`**

Append to `resources:` list:
```yaml
  - title: Airflow Tutorial – Astronomer (free)
    url: https://docs.astronomer.io/learn/get-started-with-airflow
    type: docs
    free: true
  - title: dbt Fundamentals (free official course)
    url: https://courses.getdbt.com/courses/fundamentals
    type: course
    free: true
  - title: Prefect Docs & Tutorials
    url: https://docs.prefect.io/latest/tutorial/
    type: docs
    free: true
  - title: Data Engineering Podcast (free episodes)
    url: https://www.dataengineeringpodcast.com
    type: article
    free: true
```

- [ ] **Step 4: Add resources to `content/skills/cloud-data.mdx`**

Append to `resources:` list:
```yaml
  - title: Google Cloud Skills Boost — BigQuery Path (free labs)
    url: https://www.cloudskillsboost.google/catalog?keywords=bigquery
    type: course
    free: true
  - title: dbt + BigQuery Quickstart Guide
    url: https://docs.getdbt.com/guides/bigquery
    type: docs
    free: true
  - title: Snowflake Hands-On Virtual Lab (free)
    url: https://www.snowflake.com/virtual-hands-on-lab/
    type: course
    free: true
  - title: AWS Redshift Getting Started (free)
    url: https://aws.amazon.com/redshift/getting-started/
    type: docs
    free: true
```

- [ ] **Step 5: Add resources to `content/skills/spark.mdx`**

Append to `resources:` list:
```yaml
  - title: PySpark Tutorial – freeCodeCamp (video)
    url: https://www.youtube.com/watch?v=_C8kWso4ne4
    type: video
    free: true
  - title: Databricks Free Training Courses
    url: https://www.databricks.com/learn/training/home
    type: course
    free: true
  - title: Spark by Examples (code examples & tutorials)
    url: https://sparkbyexamples.com
    type: article
    free: true
  - title: Apache Spark Official Getting Started
    url: https://spark.apache.org/docs/latest/quick-start.html
    type: docs
    free: true
```

- [ ] **Step 6: Add resources to `content/skills/streaming.mdx`**

Append to `resources:` list:
```yaml
  - title: Confluent Developer — Free Kafka Courses
    url: https://developer.confluent.io/courses/
    type: course
    free: true
  - title: Apache Kafka Quickstart (official)
    url: https://kafka.apache.org/quickstart
    type: docs
    free: true
  - title: Kafka in 100 Seconds – Fireship
    url: https://www.youtube.com/watch?v=uvb00oaa3k8
    type: video
    free: true
  - title: Flink Documentation — Getting Started
    url: https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/overview/
    type: docs
    free: true
```

- [ ] **Step 7: Verify routes respond**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/vector-databases && echo " vecdb ok"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/skill/streaming && echo " streaming ok"
```
Expected: `200 vecdb ok` and `200 streaming ok`

- [ ] **Step 8: Commit**

```bash
cd "C:\Users\BOSS\Downloads\roadmap app\roadmap-app"
git add content/skills/vector-databases.mdx content/skills/ai-agents.mdx content/skills/data-pipelines.mdx content/skills/cloud-data.mdx content/skills/spark.mdx content/skills/streaming.mdx
git commit -m "content: enrich advanced AI and data engineering skills with free courses and resources"
```
