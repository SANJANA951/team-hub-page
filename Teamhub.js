document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // THEME MANAGEMENT (LIGHT / DARK MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  
  // Check local storage for preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });

  // ==========================================================================
  // MOBILE NAVIGATION DRAWER TOGGLE
  // ==========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');

  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', (e) => {
      sidebar.classList.toggle('open');
      e.stopPropagation();
    });

    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && e.target !== mobileMenuToggle) {
          sidebar.classList.remove('open');
        }
      }
    });
  }

  // ==========================================================================
  // CREATE TEAM MODAL INTERACTIONS
  // ==========================================================================
  const createTeamModal = document.getElementById('createTeamModal');
  const openModalButtons = document.querySelectorAll('.btn-create-team-modal');
  const closeModalBtn = document.getElementById('modalCloseBtn');
  const cancelModalBtn = document.getElementById('modalCancelBtn');
  const createTeamForm = document.getElementById('createTeamForm');
  let editingCard = null;

  // Open Modal
  const openModal = () => {
    createTeamModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalTeamName').focus();
  };

  // Close Modal
  const closeModal = () => {
    createTeamModal.classList.remove('open');
    document.body.style.overflow = '';
    createTeamForm.reset();
    editingCard = null;
  };

  // Bind create modal buttons
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      editingCard = null;
      const modalTitle = document.querySelector('.modal-header h3');
      if (modalTitle) modalTitle.textContent = 'Create New Team';
      openModal();
    });
  });
  
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking on overlay background
  createTeamModal.addEventListener('click', (e) => {
    if (e.target === createTeamModal) {
      closeModal();
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && createTeamModal.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  const showToast = (message) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  // Submit New/Edit Team Form Handler
  createTeamForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const teamName = document.getElementById('modalTeamName').value;
    const teamDesc = document.getElementById('modalTeamDesc').value;
    const requiredSkills = document.getElementById('modalSkills').value;
    const maxMembers = document.getElementById('modalMaxMembers').value;

    if (editingCard) {
      // Edit mode: update values in existing card
      editingCard.querySelector('.post-card-title').textContent = teamName;
      editingCard.querySelector('.post-card-desc').textContent = teamDesc;
      
      // Update attribute names for filter system
      editingCard.setAttribute('data-name', teamName);
      editingCard.setAttribute('data-skills', requiredSkills);

      // Rebuild skill tags
      const pillsContainer = editingCard.querySelector('.post-skills-pills');
      if (pillsContainer) {
        pillsContainer.innerHTML = '';
        requiredSkills.split(',').forEach(skill => {
          const pill = document.createElement('span');
          pill.className = 'skill-pill';
          pill.textContent = skill.trim();
          pillsContainer.appendChild(pill);
        });
      }
      showToast(`Team "${teamName}" updated successfully!`);
    } else {
      // Create mode: build a new team post card dynamically
      const newCard = document.createElement('div');
      newCard.className = 'team-post-card';
      newCard.setAttribute('data-name', teamName);
      newCard.setAttribute('data-skills', requiredSkills);
      newCard.setAttribute('data-hackathon', 'hackprep-2026');

      const skillPillsHtml = requiredSkills.split(',').map(skill => `<span class="skill-pill">${skill.trim()}</span>`).join('');

      newCard.innerHTML = `
        <div class="post-card-header">
          <div class="post-card-logo" style="background-color: #1e1b4b;">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="post-card-title-area">
            <h4 class="post-card-title">${teamName}</h4>
            <span class="post-card-meta">HackPrep 2026 • 1 Member Joined</span>
          </div>
          <span class="post-status-badge open">OPEN</span>
        </div>
        <div class="post-card-body">
          <p class="post-card-desc">${teamDesc}</p>
          <div class="post-skills-pills">
            ${skillPillsHtml}
          </div>
        </div>
        <div class="post-card-footer">
          <div class="post-avatars">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Avatar" class="post-avatar">
          </div>
          <span class="post-time-ago">Just now</span>
          <a href="#" class="btn-view-details">
            <span>View Details</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      `;

      // Prepend to team list
      const list = document.getElementById('teamPostsList');
      if (list) {
        list.insertBefore(newCard, list.firstChild);
      }
      showToast(`Team "${teamName}" created successfully!`);
    }

    closeModal();
    filterTeammates();
  });

  // ==========================================================================
  // INTERACTIVE STATES VIA DELEGATED EVENT LISTENERS
  // ==========================================================================
  document.addEventListener('click', (e) => {
    
    // 1. Add Hacker Button invitation state
    const addHackerBtn = e.target.closest('.add-hacker-btn');
    if (addHackerBtn) {
      e.preventDefault();
      const hackerName = addHackerBtn.closest('.leaderboard-item').querySelector('.leader-name').textContent;
      showToast(`Invitation sent to ${hackerName}!`);
      addHackerBtn.style.color = '#22c55e';
      addHackerBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 20px; height: 20px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
      `;
      addHackerBtn.style.pointerEvents = 'none';
      return;
    }

    // 2. Edit Post Button click handler
    const editBtn = e.target.closest('.btn-edit-post');
    if (editBtn) {
      e.preventDefault();
      const card = editBtn.closest('.team-post-card');
      if (card) {
        editingCard = card;
        const title = card.querySelector('.post-card-title').textContent;
        const desc = card.querySelector('.post-card-desc').textContent;
        const skillPills = card.querySelectorAll('.skill-pill');
        const skills = Array.from(skillPills).map(p => p.textContent).join(', ');
        
        document.getElementById('modalTeamName').value = title;
        document.getElementById('modalTeamDesc').value = desc;
        document.getElementById('modalSkills').value = skills;

        const modalTitle = document.querySelector('.modal-header h3');
        if (modalTitle) modalTitle.textContent = 'Edit Team Post';
        openModal();
      }
      return;
    }

    // 3. View Details link click handler
    const viewDetailsLink = e.target.closest('.btn-view-details');
    if (viewDetailsLink) {
      e.preventDefault();
      const card = viewDetailsLink.closest('.team-post-card');
      const title = card.querySelector('.post-card-title').textContent;
      showToast(`Viewing details for: ${title}`);
      return;
    }

    // 4. Request to Join / General card clicks
    const joinBtn = e.target.closest('.btn-join-request');
    if (joinBtn) {
      e.preventDefault();
      if (!joinBtn.classList.contains('sent')) {
        joinBtn.classList.add('sent');
        joinBtn.textContent = 'Request Sent';
        joinBtn.style.backgroundColor = '#22c55e';
        joinBtn.style.color = '#ffffff';
        joinBtn.style.borderColor = '#22c55e';
        joinBtn.style.cursor = 'default';
        joinBtn.blur();
        
        const card = joinBtn.closest('.teammate-card');
        const teammateName = card.querySelector('.card-name').textContent;
        showToast(`Request sent to join ${teammateName}!`);
      }
    }
  });

  // ==========================================================================
  // SEARCH & FILTER SYSTEM
  // ==========================================================================
  const globalSearchInput = document.getElementById('globalSearchInput');
  const skillsFilter = document.getElementById('skillsFilter');
  const domainsFilter = document.getElementById('domainsFilter');
  const hackathonsFilter = document.getElementById('hackathonsFilter');
  const teammateCards = document.querySelectorAll('#teamPostsList .team-post-card');

  const filterTeammates = () => {
    const activeSearch = globalSearchInput.value.toLowerCase().trim();

    const skillVal = skillsFilter.value.toLowerCase();
    const domainVal = domainsFilter.value.toLowerCase();
    const hackathonVal = hackathonsFilter.value.toLowerCase();

    teammateCards.forEach(card => {
      const name = card.getAttribute('data-name').toLowerCase();
      const skills = card.getAttribute('data-skills').toLowerCase();
      const hackathon = card.getAttribute('data-hackathon').toLowerCase();

      const matchesSearch = !activeSearch || 
        name.includes(activeSearch) || 
        skills.includes(activeSearch);

      const matchesSkill = !skillVal || skills.includes(skillVal);

      const matchesDomain = !domainVal || 
        (domainVal === 'frontend' && name.includes('frontend')) ||
        (domainVal === 'backend' && name.includes('backend')) ||
        (domainVal === 'fullstack' && name.includes('fullstack')) ||
        (domainVal === 'design' && (name.includes('design') || name.includes('ux') || name.includes('ui')));

      const matchesHackathon = !hackathonVal || hackathon === hackathonVal;

      if (matchesSearch && matchesSkill && matchesDomain && matchesHackathon) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });
  };

  globalSearchInput.addEventListener('input', filterTeammates);
  skillsFilter.addEventListener('change', filterTeammates);
  domainsFilter.addEventListener('change', filterTeammates);
  hackathonsFilter.addEventListener('change', filterTeammates);

  // ==========================================================================
  // TABS TOGGLE SYSTEM (FIND TEAMS vs MY POSTS) WITH SMOOTH TRANSITIONS
  // ==========================================================================
  const findTeamsTab = document.getElementById('findTeamsTab');
  const myPostsTab = document.getElementById('myPostsTab');
  const teammatesGrid = document.getElementById('teamPostsList');
  const myPostsContainer = document.getElementById('myPostsContainer');
  const leftColumnTitle = document.querySelector('.main-left-column .section-title');

  // Initialize transition styles
  if (teammatesGrid) {
    teammatesGrid.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    teammatesGrid.style.opacity = '1';
    teammatesGrid.style.transform = 'translateY(0)';
  }
  if (myPostsContainer) {
    myPostsContainer.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    myPostsContainer.style.opacity = '0';
    myPostsContainer.style.transform = 'translateY(8px)';
  }

  if (findTeamsTab && myPostsTab) {
    findTeamsTab.addEventListener('click', () => {
      findTeamsTab.classList.add('active');
      myPostsTab.classList.remove('active');
      
      if (myPostsContainer) {
        myPostsContainer.style.opacity = '0';
        myPostsContainer.style.transform = 'translateY(8px)';
        setTimeout(() => {
          myPostsContainer.style.display = 'none';
          if (teammatesGrid) {
            teammatesGrid.style.display = 'flex';
            setTimeout(() => {
              teammatesGrid.style.opacity = '1';
              teammatesGrid.style.transform = 'translateY(0)';
            }, 30);
          }
        }, 200);
      }
      if (leftColumnTitle) leftColumnTitle.textContent = 'Active Team Posts';
    });

    myPostsTab.addEventListener('click', () => {
      myPostsTab.classList.add('active');
      findTeamsTab.classList.remove('active');
      
      if (teammatesGrid) {
        teammatesGrid.style.opacity = '0';
        teammatesGrid.style.transform = 'translateY(8px)';
        setTimeout(() => {
          teammatesGrid.style.display = 'none';
          if (myPostsContainer) {
            myPostsContainer.style.display = 'block';
            setTimeout(() => {
              myPostsContainer.style.opacity = '1';
              myPostsContainer.style.transform = 'translateY(0)';
            }, 30);
          }
        }, 200);
      }
      if (leftColumnTitle) leftColumnTitle.textContent = 'My Posts';
    });
  }

  // ==========================================================================
  // CUSTOM SELECT DROPDOWNS IMPLEMENTATION
  // ==========================================================================
  const selectWrappers = document.querySelectorAll('.custom-select-wrapper');
  
  selectWrappers.forEach(wrapper => {
    const select = wrapper.querySelector('select');
    if (!select) return;

    // Create trigger area
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.textContent = select.options[select.selectedIndex].text;
    wrapper.appendChild(trigger);

    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-select-options';

    // Populate options list
    Array.from(select.options).forEach((opt, idx) => {
      const customOpt = document.createElement('div');
      customOpt.className = 'custom-option' + (idx === select.selectedIndex ? ' active' : '');
      customOpt.textContent = opt.text;
      customOpt.setAttribute('data-value', opt.value);
      
      customOpt.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove active class from sibling options
        optionsContainer.querySelectorAll('.custom-option').forEach(el => el.classList.remove('active'));
        customOpt.classList.add('active');
        
        // Update select value and trigger text
        select.value = opt.value;
        trigger.textContent = opt.text;
        
        // Dispatch change event to trigger existing card filters
        select.dispatchEvent(new Event('change'));
        
        // Close dropdown
        optionsContainer.classList.remove('open');
        wrapper.classList.remove('active');
      });
      optionsContainer.appendChild(customOpt);
    });

    wrapper.appendChild(optionsContainer);

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close other opened selects
      document.querySelectorAll('.custom-select-options.open').forEach(el => {
        if (el !== optionsContainer) {
          el.classList.remove('open');
          el.parentElement.classList.remove('active');
        }
      });

      optionsContainer.classList.toggle('open');
      wrapper.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside anywhere on document
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-options.open').forEach(el => {
      el.classList.remove('open');
      el.parentElement.classList.remove('active');
    });
  });
});

