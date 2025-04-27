import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase
const supabaseUrl = 'https://YOUR-PROJECT-URL.supabase.co';
const supabaseKey = 'YOUR-ANON-KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to load existing bike history
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
      <td>${record.date_changed}</td>
      <td>${record.amount}</td>
      <td>${record.at_distance}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to handle form submit
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

  if (error) {
    console.error("Error adding bike history:", error);
    document.getElementById("bike-history-message").textContent = "Error occurred while adding bike record.";
  } else {
    document.getElementById("bike-history-message").textContent = "Bike record added successfully!";
    document.getElementById("add-bike-history-form").reset();
    loadBikeHistory();
  }
});

// Load bike history on page load
loadBikeHistory();
