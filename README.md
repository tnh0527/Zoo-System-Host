# 🦁 Zoo Management System  

This is our team project for building a **Zoo Management System** in C++.  

This README explains how to set up the repository on your device and how we will work together using Git branches.  

---

## 📥 Setup: Get the Repository on Your Device

1. **Clone the repo (first time only):**  
   ```bash
   git clone https://github.com/devondough926/Zoo-management-system.git
   cd Zoo-management-system
Check your remotes:

bash
Copy code
git remote -v
You should see origin pointing to the GitHub repo.

Configure your name and email (first time only):

bash
Copy code
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
🌱 Working on the Project
1. Create/Checkout Your Branch
Always make sure you are up to date with main first:

bash
Copy code
git checkout main
git pull origin main
Now create your feature branch (replace <branch-name> with something clear, like feature/animal-class):

bash
Copy code
git checkout -b <branch-name>
If your branch already exists on GitHub, pull it down with:

bash
Copy code
git fetch origin
git checkout <branch-name>
2. Make Changes and Save
Do your coding, editing, and testing locally.

3. Stage and Commit Your Changes
bash
Copy code
git add .
git commit -m "Short description of what you changed"
4. Push to Your Branch
bash
Copy code
git push -u origin <branch-name>
The first push needs the -u flag.

After that, just run:

bash
Copy code
git push
5. Open a Pull Request
Go to the GitHub repo in your browser.

You’ll see a Compare & Pull Request button → click it.

Make a PR from your branch → main.

The team reviews and merges when ready.

🔑 Rules for Collaboration
Do not push directly to main.

Always work on your own branch.

Use clear branch names:

feature/animal-class

bugfix/zookeeper-schedule

doc/readme-update

Keep commit messages short and clear.

Pull from main often to stay up to date.

🛠️ Compile Instructions
To build the project:

bash
Copy code
g++ -std=c++17 src/*.cpp -o zoo
./zoo
