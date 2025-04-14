document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleInlineEditBtn');
    const cancelBtn = document.getElementById('cancelInlineEdit');
    const inlineForm = document.getElementById('inlineEditForm');
    const displayView = document.querySelector('.display-view');
  
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        displayView.style.display = 'none';
        inlineForm.style.display = 'block';
        toggleBtn.style.display = 'none';
      });
    }
  
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        inlineForm.style.display = 'none';
        displayView.style.display = 'block';
        toggleBtn.style.display = 'block';
      });
    }
  
    if (inlineForm) {
      inlineForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
          title: inlineForm.querySelector('#title').value,
          description: inlineForm.querySelector('#description').value
        };
        
        try {
          const response = await fetch(inlineForm.action, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            const data = await response.json();
            const headTitleElm = document.querySelector('.col-4.text-center h4');
            const titleElm = document.querySelector('.display-view .title');
            const descriptionElm = document.querySelector('.display-view .description');
            const updatedDateElm = document.querySelector('.display-view .updatedDate');            
            headTitleElm.textContent = data.title;
            titleElm.textContent = data.title;
            descriptionElm.textContent = data.description;
            updatedDateElm.textContent = new Date(data.updatedDate).toLocaleString();
            inlineForm.style.display = 'none';
            displayView.style.display = 'block';
            toggleBtn.style.display = 'block';
          } else {
            alert('Update failed, please try again later.');
          }
        } catch (error) {
          console.error('Submission error:', error);
        }
      });
    }
  });
  
  