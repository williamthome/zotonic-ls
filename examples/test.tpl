<a href="{% url admin_edit_rsc id=42 foo="bar" absolute_url %}"></a>

<h1 class="title {% if m.req.csp_nonce as foo %}{{ foo }}{% else %}bar{% endif %}">My title</h1>
<h2 {% if foo %}class="bar"{% endif %}>My subtitle</h2>

<style attribute="My attribute {{ mytpl_attr }} some ending">
    {# some comment #}
    h1 {
        height: 10{% if cond2 %}{{ unit }}{% else %}px{% endif %};
    }
    {% if cond %}
        h2 {
            {# some comment #}
            height: 10{% if 5 * 2 == 10 %}{{ 1 * 2 }}{% else %}px{% endif %};
        }
    {% endif %}
</style>

{% comment %}
    <h2>My subtitle</h2>
    <p class="paragraph {% if `true` %}always-true{% endif %}">My words</p>
{% endcomment %}

{{ m.req.csp_nonce|lower }}

{{ m.req.csp_nonce }}

{{ #auto_gen }}

<script type="text/javascript" nonce="{{ m.req.csp_nonce }}">
    {# some comment #}
    function myfn({{ some_var }}) {
        {# some comment #}
        console.log("foo");
    };
</script>

<p>{{ id.date_start|date:"Y-m-d":id.date_is_all_day }}</p>

{{ 1|yesno:"ja,nee" }}

{% trans "Hello {foo} World" foo=1234 %}
{% trans "Hello {{foo}}, and this is {foo}." foo=1234 %}
{% trans
    "Hello {{foo}}, and this is {foo} and {bar}."
    foo=1234
    bar="bar"
%}

{# some comment #}

{% javascript %}
    {# some comment #}
    function myfn({{ some_var }}) {
        {# some comment #}
        console.log("foo");
    };

    z_notify("rev-diff", {
        id: {{ id }},
        a: "latest",
        z_delegate: `controller_admin_backup_revision`
    });
{% endjavascript %}

{% comment %}
    <h2>My subtitle</h2>
    <p class="paragraph {% if `true` %}always-true{% endif %}">My words</p>
{% endcomment %}

{% with "value1", "VALUE2"|lower as foo, bar %}
  {{ foo }}
  {{ bar }}
{% endwith %}

{% wire id="show" action={show target="message"} %}
<a id="show" href="#">Click to show a message</a>
<p style="display: none" id="message">Hello World!</p>

{% wire id="mybutton" postback={hello world="round"} %}
<button id="mybutton">Post event to server</button>

{% wire id="myform" type="submit" postback="some_tag" action={toggle target="message"} %}
{% wire
    id="myform"
    type="submit"
    postback="some_tag"
    action={toggle
        target="message"
    }
%}
<form id="myform" method="post" action="postback">
  <input type="text" name="title" value="" />
  <button id="mybutton" type="submit">Submit</button>
</form>

{#
    Issue with nested braces.
    Works removing all nested actions.
    The regex should match the last } occurence.
#}

{% wire id=#input
    type="keyup"
    action={typeselect
        target=#suggestions
        cat=m.predicate.object_category["depiction"]
        action_with_id={with_args
            action={link
                subject_id=subject_id
                predicate="depiction"
                element_id=element_id
            }
            arg={object_id select_id}
        }
        action={postback
            postback={reload_media rsc_id=id div_id=media_div_id}
            delegate="controller_admin_edit"
        }
        action_with_id={with_args
            action={zmedia_has_chosen}
            arg={id select_id}
        }
        action={dialog_close}
    }
%}

{% wire id=#input
    type="keyup"
    action={typeselect
        target=#suggestions
        cat=m.predicate.object_category["depiction"]
    }
%}

{% with `true`, `atom`, m.authentication.something as foo, bar, baz %}

{% extends "admin_base.tpl" %}

{% block title %}Two-factor Authentication Configuration{% endblock %}

{% block content %}
<div class="admin-header">
    <h2>{_ Two-factor authentication configuration _}</h2>

    {% if not m.acl.use.mod_admin_config %}
        <p class="alert alert-danger">
            {_ You need to be allowed to edit the system configuration to view or change the two-factor authentication configuration. _}
        </p>
    {% else %}
        <p>{_ Here you can define which users need or should use two-factor authentication when signing in. _}</p>
    {% endif %}

    <p>{_ You can use two-factor authentication apps such as <a rel="noopener noreferrer" target="_blank" href="https://support.google.com/accounts/answer/1066447">Google Authenticator</a> or <a rel="noopener noreferrer" target="_blank" href="https://duo.com/product/trusted-users/two-factor-authentication/duo-mobile">Duo Mobile</a>. _}</p>
</div>

<div class="widget">
    {% if m.acl.use.mod_admin_config %}
        <h3 class="widget-header">{_ Default configuration _}</h3>
        <div class="widget-content">
            <p>{_ Define who should use two-factor authentication, this is the default setting for all users. _}</p>

            <div class="form-group">
                <div>
                    {% wire id="opt2fa"
                        action={config_toggle module="mod_auth2fa" key="mode"}
                    %}
                    <label class="radio-inline">
                        <input name="2fa_mode" type="radio" id="opt2fa" value="0" {% if not m.auth2fa.mode %}checked="checked"{% endif %} />
                        {_ Optional _}
                    </label>
                </div>

                <div>
                    {% wire id="ask2fa"
                        action={config_toggle module="mod_auth2fa" key="mode"}
                    %}
                    <label class="radio-inline">
                        <input name="2fa_mode" type="radio" id="ask2fa" value="1" {% if m.auth2fa.mode  == '1' %}checked="checked"{% endif %} />
                        {_ Ask after signing in _}
                    </label>
                </div>

                <div>
                    {% wire id="force2fa"
                        action={config_toggle module="mod_auth2fa" key="mode"}
                    %}
                    <label class="radio-inline">
                        <input name="2fa_mode" type="radio" id="force2fa" value="2" {% if m.auth2fa.mode == '2' %}checked="checked"{% endif %} />
                        {_ Force two-factor authentication _}
                    </label>
                </div>
            </div>

            {% if m.modules.active.mod_acl_user_groups %}
                <h3>{_ User group configuration _}</h3>

                <p>{_ It is possible to force two-factor authentication for a specific user group, regardless of the setting above. _}</p>
                <p>{_ Check the user groups for which two-factor authentication should be forced. _}</p>

                <ul class="list-unstyled">
                    {% for cg in m.hierarchy.acl_user_group.tree_flat %}
                        {% with cg.id as cg_id %}
                        <li>
                            <label class="checkbox-inline">
                                {{ cg.indent }}
                                <input type="checkbox" id="{{ #cg.cg_id }}" {% if cg_id.acl_2fa %}checked{% endif %} value="2" {% if not cg_id.is_editable %}disabled{% endif %}>
                                {{ cg_id.title }}
                            </label>
                            {% wire id=#cg.cg_id
                                    postback={auth2fa_ug id=cg_id}
                                    delegate=`mod_auth2fa`
                            %}
                        </li>
                        {% endwith %}
                    {% endfor %}
                </ul>
            {% endif %}
        </div>
    {% endif %}
</div>
{% endblock %}

{% if forloop.first %}

{% worker name="auth" src="js/zotonic.auth.worker.js" args=%{  auth: m.authentication.status  } %}
