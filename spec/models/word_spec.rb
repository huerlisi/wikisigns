require 'spec_helper'

describe Word do
  context ".without_space" do
    it "should drop words with spaces" do
      Word.without_space.count.should == 0
    end
  end
end
