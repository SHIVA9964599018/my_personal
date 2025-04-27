
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase
    const supabaseUrl = 'https://wzgchcvyzskespcfrjvi.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z2NoY3Z5enNrZXNwY2ZyanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjQwNDEsImV4cCI6MjA1NzQ0MDA0MX0.UuAgu4quD9Vg80tOUSkfGJ4doOT0CUFEUeoHsiyeNZQ'
    const supabase = createClient(supabaseUrl, supabaseKey)

// Format date to dd-mm-yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Load Bike History
async function loadBikeHistory() {
  const { data, error } = await supabase
    .from('bike_history')
    .select('*')
    .order('date_changed', { ascending: false });

  if (error) {
    console.error("Error loading bike history:", error);
    return;
  }

  const tableBody = document.querySelector("#bike-history-table tbody");
  tableBody.innerHTML = "";

  data.forEach(record => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDate(record.date_changed)}</td>
      <td>₹ ${record.amount}</td>
      <td>${record.at_distance} km</td>
    `;
    tableBody.appendChild(row);
  });
}

// Handle Form Submit
document.getElementById("add-bike-history-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const dateChanged = document.getElementById("date_changed").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const atDistance = parseInt(document.getElementById("at_distance").value);

  const { error } = await supabase
    .from('bike_history')
    .insert([{ 
      date_changed: dateChanged, 
      amount: amount, 
      at_distance: atDistance 
    }]);

  const messageBox = document.getElementById("bike-history-message");

  if (error) {
    console.error("Error adding bike history:", error);
    messageBox.textContent = "❌ Error occurred while adding record.";
    messageBox.style.color = "red";
  } else {
    messageBox.textContent = "✅ Bike record added successfully!";
    messageBox.style.color = "green";
    document.getElementById("add-bike-history-form").reset();
    loadBikeHistory();
  }
});

// Load on page
loadBikeHistory();

