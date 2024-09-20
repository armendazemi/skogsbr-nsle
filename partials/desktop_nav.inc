<accordion-group>
  <ul class="d-none d-lg-flex align-items-center justify-content-center column-gap-lg list-unstyled m-0">

    <accordion-component>
      <li class="desktop-nav-item position-relative">
        <button type="button"
                class="w-100 d-flex column-gap-2xs justify-content-between align-items-center bg-transparent text-white fw-semi padding-x-0 padding-y-sm">
          {{ "Sälja skogsbränsle" | t }}
          <span class="material-symbols-rounded sm">keyboard_arrow_down</span>
        </button>
        <div class="desktop-dropdown dropdown bg-brand-light radius-sm shadow-lg">
          <ul class="padding-sm list-unstyled">
            <li class="desktop-nav-item">
              <a href="/salja-skogsflis"
                 class="black-link fw-semi padding-sm">{{ "Sälja skogsflis" | t }}</a>
            </li>
            {% for item in site.all_pages %}
              {% if item.id == 39599 %}
                {% for childpage in item.children %}
                  <li class="desktop-nav-item">
                    <a href="{{ childpage.url }}"
                       class="black-link fw-semi padding-sm">{{ childpage.title }}</a>
                  </li>
                {% endfor %}
              {% endif %}
            {% endfor %}
          </ul>
        </div>
      </li>
    </accordion-component>

    <li class="desktop-nav-item">
      <a href="/tjanster"
         class="white-link fw-semi padding-x-sm">{{ "Våra tjänster" | t }}</a>
    </li>

    <li class="desktop-nav-item">
      <a href="/tjanster"
         class="white-link fw-semi padding-x-sm">
        <img src="https://d1da7yrcucvk6m.cloudfront.net/sites/526/media/1196324_small_logo-white.webp?1726653634"
             height="121" width="150" alt="">
      </a>
    </li>

    <li class="desktop-nav-item">
      <a href="/om-oss"
         class="white-link fw-semi padding-x-sm">{{ "Om oss" | t }}</a>
    </li>

    <li class="desktop-nav-item">
      <a href="/kontakt"
         class="white-link fw-semi padding-x-sm">{{ "Kontakta oss" | t }}</a>
    </li>
  </ul>
</accordion-group>
