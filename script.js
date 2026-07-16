const API_URL = "https://xcs6z6kzd1.execute-api.ap-south-1.amazonaws.com";

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  totalInstances: document.getElementById("totalInstances"),

  runningInstances: document.getElementById("runningInstances"),

  stoppedInstances: document.getElementById("stoppedInstances"),

  autoStopInstances: document.getElementById("autoStopInstances"),

//   estimatedSavings: document.getElementById("estimatedSavings"),

//   monthlySavings: document.getElementById("monthlySavings"),
//   impactAutoStop: document.getElementById("impactAutoStop"),

  instanceList: document.getElementById("instanceList"),

  lastUpdated: document.getElementById("lastUpdated"),

  refreshButton: document.getElementById("refreshButton"),

  optimizeButton: document.getElementById("optimizeButton"),

  toast: document.getElementById("toast"),

  toastMessage: document.getElementById("toastMessage"),
};

// ============================================
// LOAD EC2 INSTANCES
// ============================================

async function loadInstances() {
  try {
    elements.refreshButton.classList.add("loading");

    elements.instanceList.innerHTML = `

            <div class="loading-state">

                <div class="loader"></div>

                <span>
                    Loading AWS resources...
                </span>

            </div>

        `;

    const response = await fetch(`${API_URL}/instances`);

    if (!response.ok) {
      throw new Error("Failed to fetch EC2 instances");
    }

    const data = await response.json();

    updateDashboard(data);

    elements.lastUpdated.textContent = formatTime(new Date());
  } catch (error) {
    console.error("Error loading instances:", error);

    elements.instanceList.innerHTML = `

            <div class="loading-state">

                ⚠️ Unable to load AWS resources

            </div>

        `;

    showToast("Unable to connect to AWS API");
  } finally {
    elements.refreshButton.classList.remove("loading");
  }
}

// ============================================
// UPDATE DASHBOARD
// ============================================

function updateDashboard(data) {
  const summary = data.summary || {};

  const instances = data.instances || [];

  // -----------------------------
  // UPDATE METRICS
  // -----------------------------

  elements.totalInstances.textContent = summary.totalInstances ?? 0;

  elements.runningInstances.textContent = summary.runningInstances ?? 0;

  elements.stoppedInstances.textContent = summary.stoppedInstances ?? 0;

  elements.autoStopInstances.textContent = summary.autoStopEnabled ?? 0;


  if (
    elements.impactAutoStop
) {

    elements.impactAutoStop.textContent =
        summary.autoStopEnabled
        ?? 0;

}
  // -----------------------------
  // CALCULATE SAVINGS
  // -----------------------------

  const estimatedSavings = calculateEstimatedSavings(instances);

  const formattedSavings = formatCurrency(estimatedSavings);

  if (elements.estimatedSavings) {
    elements.estimatedSavings.textContent = formattedSavings;
  }

  if (elements.monthlySavings) {
    elements.monthlySavings.textContent = formattedSavings;
  }

  // -----------------------------
  // RENDER INSTANCE LIST
  // -----------------------------

  renderInstances(instances);
}

// ============================================
// ESTIMATED COST SAVINGS
// ============================================

function calculateEstimatedSavings(instances) {
  /*
        Approximate hourly rates.

        These are simplified estimates
        for demonstration purposes.

        Actual EC2 pricing depends on:

        - AWS Region
        - Operating System
        - On-Demand / Reserved pricing
        - Instance purchasing model
    */

  const hourlyRates = {
    "t2.micro": 0.0116,

    "t3.micro": 0.0104,

    "t2.small": 0.023,

    "t3.small": 0.0208,

    "t3.medium": 0.0416,

    "t2.medium": 0.0464,
  };

  let totalSavings = 0;

  instances.forEach((instance) => {
    const state = String(instance.state || "").toLowerCase();

    const autoStop = String(instance.autoStop || "").toLowerCase();

    const instanceType = instance.instanceType;

    const isStopped = state === "stopped";

    const isAutoStopEnabled = autoStop === "true";

    if (isStopped && isAutoStopEnabled) {
      const hourlyRate = hourlyRates[instanceType] || 0.01;

      const monthlySavings = hourlyRate * 24 * 30;

      totalSavings += monthlySavings;
    }
  });

  return totalSavings;
}

// ============================================
// FORMAT CURRENCY
// ============================================

function formatCurrency(amount) {
  return new Intl.NumberFormat(
    "en-US",

    {
      style: "currency",

      currency: "USD",

      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    },
  ).format(amount);
}

// ============================================
// RENDER EC2 INSTANCES
// ============================================

function renderInstances(instances) {
  if (!instances || instances.length === 0) {
    elements.instanceList.innerHTML = `

            <div class="loading-state">

                No EC2 instances found

            </div>

        `;

    return;
  }

  elements.instanceList.innerHTML = instances
    .map((instance) => {
      const isRunning = instance.state === "running";

      const autoStopEnabled =
        String(instance.autoStop || "").toLowerCase() === "true";

      return `


                    <div class="instance-row">


                        <!-- RESOURCE -->


                        <div class="resource-name">


                            <div class="resource-icon">

                                <i data-lucide="server"></i>

                            </div>


                            <div>


                                <strong>

                                    ${escapeHtml(instance.name)}

                                </strong>


                                <small>

                                    ${escapeHtml(instance.instanceId)}

                                </small>


                            </div>


                        </div>



                        <!-- ENVIRONMENT -->


                        <div class="environment">

                            ${escapeHtml(instance.environment || "Unknown")}

                        </div>



                        <!-- INSTANCE TYPE -->


                        <div class="instance-type">

                            ${escapeHtml(instance.instanceType || "Unknown")}

                        </div>



                        <!-- STATUS -->


                        <div>


                            <div class="status-pill ${
                              isRunning ? "running" : "stopped"
                            }">


                                <span></span>


                                ${escapeHtml(
                                  String(
                                    instance.state || "unknown",
                                  ).toUpperCase(),
                                )}


                            </div>


                        </div>



                        <!-- COST PROTECTION -->


                        <div>


                            <div class="protection-pill ${
                              autoStopEnabled ? "enabled" : "protected"
                            }">


                                <i data-lucide="${
                                  autoStopEnabled ? "zap" : "shield"
                                }"></i>


                                ${
                                  autoStopEnabled
                                    ? "AUTO-STOP ENABLED"
                                    : "PROTECTED"
                                }


                            </div>


                        </div>


                    </div>


                `;
    })
    .join("");

  lucide.createIcons();
}

// ============================================
// FORMAT TIME
// ============================================

function formatTime(date) {
  return date.toLocaleTimeString(
    [],

    {
      hour: "2-digit",

      minute: "2-digit",
    },
  );
}

// ============================================
// ESCAPE HTML
// ============================================

function escapeHtml(value) {
  return String(value)
    .replace(
      /&/g,

      "&amp;",
    )

    .replace(
      /</g,

      "&lt;",
    )

    .replace(
      />/g,

      "&gt;",
    )

    .replace(
      /"/g,

      "&quot;",
    )

    .replace(
      /'/g,

      "&#039;",
    );
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message) {
  elements.toastMessage.textContent = message;

  elements.toast.classList.add("show");

  setTimeout(
    () => {
      elements.toast.classList.remove("show");
    },

    3500,
  );
}

// ============================================
// REFRESH BUTTON
// ============================================

elements.refreshButton.addEventListener(
  "click",

  () => {
    loadInstances();

    showToast("Infrastructure data refreshed");
  },
);

// ============================================
// OPTIMIZATION BUTTON
// ============================================

elements.optimizeButton.addEventListener(
  "click",

  async () => {
    const originalText = elements.optimizeButton.innerHTML;

    elements.optimizeButton.disabled = true;

    elements.optimizeButton.innerHTML = `


            <div class="loader"></div>


            <span>

                Optimizing...

            </span>


        `;

    try {
      const response = await fetch(
        `${API_URL}/optimize`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({}),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Optimization failed");
      }

      showToast(data.message || "Optimization completed successfully");

      setTimeout(
        () => {
          loadInstances();
        },

        3000,
      );
    } catch (error) {
      console.error(
        "Optimization error:",

        error,
      );

      showToast("Optimization failed: " + error.message);
    } finally {
      elements.optimizeButton.disabled = false;

      elements.optimizeButton.innerHTML = originalText;

      lucide.createIcons();
    }
  },
);

// ============================================
// INITIALIZE LUCIDE ICONS
// ============================================

lucide.createIcons();

// ============================================
// INITIAL DATA LOAD
// ============================================

loadInstances();

// ============================================
// AUTO REFRESH EVERY 60 SECONDS
// ============================================

setInterval(
  loadInstances,

  60000,
);
