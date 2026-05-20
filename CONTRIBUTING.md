# Contributing to Customer Support Chatbot

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/customer-support-chatbot.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit with clear messages: `git commit -m "Add feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For testing and linting
python -m pytest  # Run tests
```

### Frontend
```bash
cd frontend
npm install
npm start  # Start dev server
npm test   # Run tests
```

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Use descriptive variable names
- Max line length: 100 characters

### JavaScript (Frontend)
- Use Prettier for formatting
- Use ESLint for linting
- Follow React best practices
- Use functional components

## Testing

### Backend Testing
```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app

# Run specific test
python -m pytest tests/test_auth.py
```

### Frontend Testing
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 50 characters
- Reference issues: "Fixes #123"

## Pull Request Process

1. Update README.md if needed
2. Add/update tests for new features
3. Ensure all tests pass
4. Add description of changes
5. Link related issues
6. Request review from maintainers

## Areas for Contribution

### Backend
- [ ] Add more AI features
- [ ] Improve error handling
- [ ] Add API rate limiting
- [ ] Enhance authentication
- [ ] Add webhook integrations
- [ ] Improve database queries

### Frontend
- [ ] Improve UI/UX
- [ ] Add dark mode
- [ ] Add mobile responsiveness
- [ ] Add accessibility features
- [ ] Improve performance
- [ ] Add more pages

### Documentation
- [ ] Improve API documentation
- [ ] Add tutorials
- [ ] Add FAQ
- [ ] Add troubleshooting guide
- [ ] Add architecture overview

### Infrastructure
- [ ] Add CI/CD pipeline
- [ ] Improve Docker setup
- [ ] Add monitoring
- [ ] Add logging
- [ ] Add backup system

## Feature Request

To suggest a feature:
1. Check if it's already reported
2. Create an issue with title: "[Feature Request] Your idea"
3. Describe the feature and why it would be useful
4. Provide examples if possible

## Bug Report

To report a bug:
1. Check if it's already reported
2. Create an issue with title: "[Bug] Brief description"
3. Include steps to reproduce
4. Include expected and actual behavior
5. Include environment details
6. Attach screenshots if applicable

## Questions & Support

- Use GitHub Discussions for questions
- Check existing issues for similar questions
- Join our community chat for real-time help

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make this project better! 🎉
