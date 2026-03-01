from playwright.sync_api import sync_playwright, expect

def verify_redesign(page, viewport_width, screenshot_path):
    page.set_viewport_size({"width": viewport_width, "height": 800})
    page.goto("http://localhost:4321/")

    # Wait for the browser container
    browser_container = page.locator("#browser-container")
    expect(browser_container).to_be_visible()

    # Use a more robust selector that doesn't rely on data-app-id if possible
    # or escape the dots in the ID selector.
    # The IDs are generated as: name.toLowerCase().replace(/\s+/g, '-')
    # "Story.cv" -> "story.cv"
    # To use it in a CSS selector, the dot must be escaped: #content-story\.cv

    first_tab = page.locator(".browser-tab").first
    first_tab_id = first_tab.get_attribute("data-app-id")
    # Escape dot for CSS selector
    safe_id = first_tab_id.replace(".", "\\.")
    first_content = page.locator(f"#content-{safe_id}")

    expect(first_content).to_be_visible()

    # Check for the banner (logo and description)
    # The banner is the first child of the app content div
    banner = first_content.locator("div.px-5.py-4")
    expect(banner).to_be_visible()

    # Take screenshot of the browser container
    browser_container.screenshot(path=screenshot_path)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        desktop_page = browser.new_page()
        verify_redesign(desktop_page, 1280, "verification/desktop_redesign.png")
        desktop_page.close()

        # Mobile
        mobile_page = browser.new_page()
        verify_redesign(mobile_page, 390, "verification/mobile_redesign.png")
        mobile_page.close()

        browser.close()
