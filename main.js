(function() {
    // Create and append the necessary CSS styles for the feedback button and modal
    const style = document.createElement('style');
    style.textContent = `
        .feedback-container #feedback-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .feedback-container #feedback-button:hover {
            background-color: #0056b3;
        }
        .feedback-container .feedback-modal .modal-header {
            background-color: #007bff;
            color: #fff;
        }
        .feedback-container .feedback-modal .alert-success {
            color: green;
        }
        .feedback-container .feedback-modal .alert-danger {
            color: red;
        }
    `;
    document.head.appendChild(style);

    // Load Bootstrap CSS
    const bootstrapCss = document.createElement('link');
    bootstrapCss.rel = 'stylesheet';
    bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCss);

    // Load Bootstrap JS and then create the button and modal
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    script.id = 'feedback-js';
    document.body.appendChild(script);

    script.onload = function() {
        function createFeedbackButtonAndModal(source) {
            // Create a container for feedback components
            const feedbackContainer = document.createElement('div');
            feedbackContainer.className = 'feedback-container';

            // Create the button
            const button = document.createElement('button');
            button.id = 'feedback-button';
            button.textContent = 'Give Feedback';

            // Button click event to show modal
            button.addEventListener('click', function() {
                var feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));

                // Reset modal fields on opening
                document.getElementById('feedbackForm').style.display = 'block';
                document.getElementById('feedbackForm').reset();
                document.getElementById('feedbackMessage').style.display = 'none';
                document.getElementById('loadingIndicator').style.display = 'none';

                feedbackModal.show();
            });

            // Append the button to the container
            feedbackContainer.appendChild(button);

            // Create the modal
            const modalHtml = `
                <div class="modal fade feedback-modal" id="feedbackModal" tabindex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="feedbackModalLabel">We'd Love Your Feedback!</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="feedbackForm">
                                    <div class="mb-3">
                                        <label for="name" class="form-label">Your Name</label>
                                        <input type="text" class="form-control" id="name" placeholder="Enter your name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="comment" class="form-label">Your Comment</label>
                                        <textarea class="form-control" id="comment" rows="4" placeholder="Share your thoughts" required></textarea>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary">Submit Feedback</button>
                                    </div>
                                </form>
                                <div id="feedbackMessage" class="mt-3" style="display:none;"></div>
                                <div id="loadingIndicator" class="text-center" style="display:none;">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Processing...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append the modal HTML to the container
            feedbackContainer.insertAdjacentHTML('beforeend', modalHtml);

            // Append the container to the body
            document.body.appendChild(feedbackContainer);

            // Handle form submission
            document.getElementById('feedbackForm').addEventListener('submit', async function(event) {
                event.preventDefault(); // Prevent traditional form submission
                
                const name = document.getElementById('name').value;
                const comment = document.getElementById('comment').value;

                // Show loading indicator and hide previous messages
                document.getElementById('loadingIndicator').style.display = 'block';
                document.getElementById('feedbackMessage').style.display = 'none';

                try {
                    // Submit feedback via API
                    const response = await fetch('https://api.oroz.space/api/feedback', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, message: comment, source })
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log('Feedback submitted:', data);

                    // Clear the form fields
                    document.getElementById('feedbackForm').style.display = 'none';
                    document.getElementById('feedbackForm').reset();
                    // Show success message
                    document.getElementById('feedbackMessage').style.display = 'block';
                    document.getElementById('feedbackMessage').textContent = 'Thank you for your feedback!';
                    document.getElementById('feedbackMessage').className = 'alert alert-success';
                    
                    // Wait for 2 seconds, then close modal
                    setTimeout(() => {
                        const feedbackModal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
                        feedbackModal.hide();
                    }, 2000);

                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);

                    // Show error message
                    document.getElementById('feedbackMessage').style.display = 'block';
                    document.getElementById('feedbackMessage').textContent = 'Failed to submit feedback. Please try again.';
                    document.getElementById('feedbackMessage').className = 'alert alert-danger';
                } finally {
                    // Hide loading indicator after processing
                    document.getElementById('loadingIndicator').style.display = 'none';
                }
            });
        }

        // Determine the source from the script element or use a default
        const scriptElement = document.getElementById('feedback-script');
        const source = scriptElement ? scriptElement.getAttribute('data-source') || 'default_source' : 'default_source';

        // Initialize the feedback button and modal
        createFeedbackButtonAndModal(source);
    };
})();
