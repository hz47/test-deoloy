document.addEventListener('DOMContentLoaded', function() {
    // Function to create and append the feedback button and modal
    function createFeedbackButtonAndModal(source) {
        // Create the button (same as in your code)
        const button = document.createElement('button');
        button.id = 'feedback-button';
        button.textContent = 'Give Feedback';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';

        // Add hover effect (same as in your code)
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = '#0056b3';
        });
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '#007bff';
        });

        // Button click event to show modal (same as in your code)
        button.addEventListener('click', function() {
            var feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
            document.getElementById('feedbackForm').reset();
            document.getElementById('feedbackMessage').style.display = 'none';
            document.getElementById('loadingIndicator').style.display = 'none';
            feedbackModal.show();
        });

        document.body.appendChild(button);

        // Add modal to the page (same as in your code)
        const modalHtml = `...`;  // The modal HTML remains the same
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('feedbackForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const comment = document.getElementById('comment').value;

            document.getElementById('loadingIndicator').style.display = 'block';
            document.getElementById('feedbackMessage').style.display = 'none';

            try {
                const response = await fetch('https://api.oroz.space/api/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, message: comment, source })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                console.log('Feedback submitted:', data);

                document.getElementById('feedbackForm').remove();
                document.getElementById('feedbackMessage').style.display = 'block';
                document.getElementById('feedbackMessage').textContent = 'Thank you for your feedback!';
                document.getElementById('feedbackMessage').className = 'alert alert-success';

                setTimeout(() => {
                    document.getElementById('loadingIndicator').style.display = 'none';
                    const feedbackModal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
                    feedbackModal.hide();
                }, 2000);

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                document.getElementById('feedbackMessage').style.display = 'block';
                document.getElementById('feedbackMessage').textContent = 'Failed to submit feedback. Please try again.';
                document.getElementById('feedbackMessage').className = 'alert alert-danger';
            } finally {
                document.getElementById('loadingIndicator').style.display = 'none';
            }
        });
    }

    // Get the source from the <script> tag's data attribute
    const scriptTag = document.querySelector('script[data-source]');
    const source = scriptTag.getAttribute('data-source') || 'default-source';

    // Load Bootstrap JS, then create the button and modal
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    script.onload = () => createFeedbackButtonAndModal(source);
    document.body.appendChild(script);
});
