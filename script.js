const API_URL =
    "https://xcs6z6kzd1.execute-api.ap-south-1.amazonaws.com";

const elements = {

    totalInstances:
        document.getElementById("totalInstances"),

    runningInstances:
        document.getElementById("runningInstances"),

    stoppedInstances:
        document.getElementById("stoppedInstances"),

    autoStopInstances:
        document.getElementById("autoStopInstances"),

    instanceList:
        document.getElementById("instanceList"),

    lastUpdated:
        document.getElementById("lastUpdated"),

    refreshButton:
        document.getElementById("refreshButton"),

    optimizeButton:
        document.getElementById("optimizeButton"),

    toast:
        document.getElementById("toast"),

    toastMessage:
        document.getElementById("toastMessage")

};


async function loadInstances() {

    try {

        elements.refreshButton.classList.add("loading");

        elements.instanceList.innerHTML = `

            <div class="loading-state">

                <div class="loader"></div>

                <span>Loading AWS resources...</span>

            </div>

        `;


        const response = await fetch(
            `${API_URL}/instances`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch EC2 instances"
            );

        }


        const data = await response.json();


        updateDashboard(data);


        elements.lastUpdated.textContent =
            formatTime(new Date());


    }

    catch (error) {

        console.error(error);


        elements.instanceList.innerHTML = `

            <div class="loading-state">

                ⚠️ Unable to load AWS resources

            </div>

        `;

        showToast(
            "Unable to connect to AWS API"
        );

    }

    finally {

        elements.refreshButton.classList.remove(
            "loading"
        );

    }

}


function updateDashboard(data) {

    const summary = data.summary;

    elements.totalInstances.textContent =
        summary.totalInstances;

    elements.runningInstances.textContent =
        summary.runningInstances;

    elements.stoppedInstances.textContent =
        summary.stoppedInstances;

    elements.autoStopInstances.textContent =
        summary.autoStopEnabled;


    renderInstances(data.instances);

}


function renderInstances(instances) {

    if (!instances || instances.length === 0) {

        elements.instanceList.innerHTML = `

            <div class="loading-state">

                No EC2 instances found

            </div>

        `;

        return;

    }


    elements.instanceList.innerHTML =
        instances.map(instance => {

            const isRunning =
                instance.state === "running";


            const autoStopEnabled =
                instance.autoStop === "true";


            return `

                <div class="instance-row">

                    <div class="resource-name">

                        <div class="resource-icon">

                            <i data-lucide="server"></i>

                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    instance.name
                                )}
                            </strong>

                            <small>
                                ${instance.instanceId}
                            </small>

                        </div>

                    </div>


                    <div class="environment">

                        ${escapeHtml(
                            instance.environment
                        )}

                    </div>


                    <div class="instance-type">

                        ${instance.instanceType}

                    </div>


                    <div>

                        <div class="status-pill ${
                            isRunning
                                ? "running"
                                : "stopped"
                        }">

                            <span></span>

                            ${instance.state.toUpperCase()}

                        </div>

                    </div>


                    <div>

                        <div class="protection-pill ${
                            autoStopEnabled
                                ? "enabled"
                                : "protected"
                        }">

                            <i data-lucide="${
                                autoStopEnabled
                                    ? "zap"
                                    : "shield"
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

        }).join("");


    lucide.createIcons();

}


function formatTime(date) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function showToast(message) {

    elements.toastMessage.textContent =
        message;


    elements.toast.classList.add(
        "show"
    );


    setTimeout(() => {

        elements.toast.classList.remove(
            "show"
        );

    }, 3500);

}


elements.refreshButton.addEventListener(
    "click",
    () => {

        loadInstances();

        showToast(
            "Infrastructure data refreshed"
        );

    }
);


elements.optimizeButton.addEventListener(
    "click",
    async () => {

        const originalText =
            elements.optimizeButton.innerHTML;

        elements.optimizeButton.disabled = true;

        elements.optimizeButton.innerHTML = `
            <div class="loader"></div>
            <span>Optimizing...</span>
        `;

        try {

            const response = await fetch(
                `${API_URL}/optimize`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({})
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Optimization failed"
                );
            }

            showToast(
                data.message ||
                "Optimization completed successfully"
            );

            setTimeout(
                loadInstances,
                3000
            );

        } catch (error) {

            console.error(error);

            showToast(
                "Optimization failed: "
                + error.message
            );

        } finally {

            elements.optimizeButton.disabled =
                false;

            elements.optimizeButton.innerHTML =
                originalText;

            lucide.createIcons();

        }

    }
);


lucide.createIcons();


loadInstances();


setInterval(
    loadInstances,
    60000
);