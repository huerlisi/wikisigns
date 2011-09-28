module Rack
  class ChromeFrame

    def initialize(app, options={})
      @app = app
      @options = options
    end

    def call(env)      

      if env['HTTP_USER_AGENT'] =~ /MSIE/
        if env['HTTP_USER_AGENT'] =~ /chromeframe/
          status, headers, response = @app.call(env)
          new_body = insert_tag(build_response_body(response))
          new_headers = recalculate_body_length(headers, new_body)
          return [status, new_headers, new_body]
        elsif @options[:minimum].nil? or ie_version(env['HTTP_USER_AGENT']) < @options[:minimum]
          status, headers, response = @app.call(env)
          new_response = add_install_chrome_frame(build_response_body(response))
          new_header = recalculate_body_length(headers, new_response)
          return [200, new_header, new_response]
        end
      end
      @app.call(env)
    end

    def add_install_chrome_frame(response)
      response.gsub!(/<title>.*<\/title>/, '<title>Bitte installiere das Google Chrome Frame!</title>')
      url = "http://wikisigns.ch"
      cf_installer = <<-CF_INSTALLER
        <body>
          <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>
          <script>CFInstall.check({ mode: "overlay", destination: "#{url}" });</script>
      CF_INSTALLER
      response.gsub!('<body>', cf_installer)

      response
    end

    def build_response_body(response)
      response_body = ""
      response.each { |part| response_body += part }
 
      response_body
    end

    def recalculate_body_length(headers, body)
      new_headers = headers
      new_headers["Content-Length"] = body.length.to_s

      new_headers
    end

    def insert_tag(body)
      head = <<-HEAD
        <meta http-equiv="X-UA-Compatible" content="chrome=1">
      HEAD
      body.gsub!('<head>', "<head>\n" + head )

      body
    end

    def ie_version(ua_string)
      ua_string.match(/MSIE (\S+)/)[1].to_f
    end
  end
end
